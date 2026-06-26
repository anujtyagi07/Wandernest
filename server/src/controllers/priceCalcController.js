import PriceConfig from '../models/PriceConfig.js';
import Package from '../models/Package.js';
import AppError from '../utils/AppError.js';

/**
 * GET /api/v1/price-calculator/config
 */
export const getConfig = async (req, res, next) => {
  try {
    let config = await PriceConfig.findOne().populate('packages.packageId', 'title basePrice duration');

    if (!config) {
      // Return defaults from Package collection
      const packages = await Package.find({ isActive: true }).select('title basePrice duration');
      config = {
        packages: packages.map((p) => ({ packageId: p, basePrice: p.basePrice })),
        roomTypes: [
          { id: 'standard', name: 'Standard Room', multiplier: 1, desc: 'Comfortable twin/double sharing' },
          { id: 'deluxe', name: 'Deluxe Room', multiplier: 1.3, desc: 'Premium room with valley views' },
          { id: 'suite', name: 'Luxury Suite', multiplier: 1.8, desc: 'Spacious suite with private balcony' },
          { id: 'camp', name: 'Premium Camp', multiplier: 0.85, desc: 'Luxury tent/camp accommodation' },
        ],
        addons: [
          { id: 'meals', name: 'Premium Meal Plan', price: 3500, icon: 'Utensils', desc: 'All meals included (B/L/D + snacks)' },
          { id: 'excursion', name: 'Extra Excursions', price: 5000, icon: 'Compass', desc: 'Additional sightseeing spots' },
          { id: 'photography', name: 'Photography Package', price: 7500, icon: 'Camera', desc: 'Professional photographer for 2 days' },
          { id: 'helicopter', name: 'Helicopter Transfer', price: 25000, icon: 'Mountain', desc: 'Helicopter ride for mountain segments' },
          { id: 'spa', name: 'Spa & Wellness', price: 4500, icon: 'BedDouble', desc: 'Ayurvedic spa sessions (2 sessions)' },
          { id: 'guide', name: 'Private Guide', price: 6000, icon: 'MapPin', desc: 'Dedicated English-speaking guide' },
        ],
      };
    }

    res.json({ success: true, data: config });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/price-calculator/calculate
 */
export const calculate = async (req, res, next) => {
  try {
    const { packageIndex, adults, children, room, addons } = req.body;

    let config = await PriceConfig.findOne().populate('packages.packageId');

    if (!config || !config.packages.length) {
      const packages = await Package.find({ isActive: true }).select('basePrice');
      const pkg = packages[packageIndex || 0];
      if (!pkg) return next(AppError.badRequest('Invalid package selection'));

      const roomMult = getRoomMultiplier(room);
      const basePerPerson = pkg.basePrice * roomMult;
      const total = calcTotal(basePerPerson, adults || 2, children || 0, getAddonTotal(addons, config), adults || 2, children || 0);

      return res.json({ success: true, data: { total, perPerson: Math.round(basePerPerson) } });
    }

    const pkgEntry = config.packages[packageIndex || 0];
    if (!pkgEntry) return next(AppError.badRequest('Invalid package selection'));

    const roomMult = getRoomMultiplierFromConfig(room, config.roomTypes);
    const basePerPerson = pkgEntry.basePrice * roomMult;
    const addonTotal = getAddonTotalFromConfig(addons, config.addons);
    const total = calcTotal(basePerPerson, adults || 2, children || 0, addonTotal, adults || 2, children || 0);

    res.json({ success: true, data: { total, perPerson: Math.round(basePerPerson) } });
  } catch (error) { next(error); }
};

const getRoomMultiplier = (room) => {
  const map = { standard: 1, deluxe: 1.3, suite: 1.8, camp: 0.85 };
  return map[room] || 1;
};

const getRoomMultiplierFromConfig = (roomId, roomTypes) => {
  const room = roomTypes.find((r) => r.id === roomId);
  return room ? room.multiplier : 1;
};

const getAddonTotal = (addons) => 0; // Default fallback
const getAddonTotalFromConfig = (selectedIds, addons) => {
  if (!selectedIds || !selectedIds.length) return 0;
  return selectedIds.reduce((sum, id) => {
    const addon = addons.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
};

const calcTotal = (basePerPerson, adults, children, addonTotal, totalAdults, totalChildren) => {
  const adultCost = basePerPerson * adults;
  const childCost = basePerPerson * 0.6 * children;
  const addonCost = addonTotal * (totalAdults + totalChildren);
  return Math.round(adultCost + childCost + addonCost);
};
