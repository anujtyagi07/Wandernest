/**
 * WanderNest Database Seeder
 * Run: cd server && node seeds/seed.js
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Package from '../src/models/Package.js';
import Hotel from '../src/models/Hotel.js';
import Destination from '../src/models/Destination.js';
import PriceConfig from '../src/models/PriceConfig.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wandernest';

// ── Packages Data ──
const packagesData = [
  {
    title: 'Complete Chardham Yatra', subtitle: 'Sacred pilgrimage to all four dhams',
    description: 'Sacred pilgrimage covering all four divine dhams — Badrinath, Kedarnath, Gangotri & Yamunotri. Experience the spiritual heart of India through ancient temples, breathtaking Himalayan landscapes, and the sacred rivers that define Hindu devotion.',
    location: 'Uttarakhand', duration: '12 Days', basePrice: 45999, category: 'Pilgrimage',
    group: 20, icon: 'Mountain', gradient: 'from-[#2B3A52] via-primary-900 to-primary-700',
    images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Arrival in Haridwar', desc: 'Welcome and orientation', highlights: ['Check-in', 'Evening Ganga Aarti'] },
      { day: 2, title: 'Haridwar to Barkot', desc: 'Scenic mountain drive', highlights: ['Mountain views', 'Overnight in Barkot'] },
      { day: 3, title: 'Yamunotri Trek', desc: 'Trek to the source of Yamuna', highlights: ['Surya Kund', 'Yamunotri Temple'] },
      { day: 4, title: 'Barkot to Uttarkashi', desc: 'Journey through valleys', highlights: ['Scenic stops', 'Local markets'] },
      { day: 5, title: 'Gangotri Darshan', desc: 'Visit the origin of Ganga', highlights: ['Gangotri Temple', 'Bhagirathi Shila'] },
      { day: 6, title: 'Uttarkashi to Guptkashi', desc: 'Drive to Kedarnath base', highlights: ['Vishwanath Temple'] },
      { day: 7, title: 'Kedarnath Trek', desc: 'Helicopter/trek to Kedarnath', highlights: ['Kedarnath Temple', 'Himalayan views'] },
      { day: 8, title: 'Kedarnath to Guptkashi', desc: 'Return trek', highlights: ['Morning prayers', 'Valley descent'] },
      { day: 9, title: 'Guptkashi to Badrinath', desc: 'Drive to the last dham', highlights: ['Carpeted roads', 'Mountain passes'] },
      { day: 10, title: 'Badrinath Darshan', desc: 'Temple visit and exploration', highlights: ['Badrinath Temple', 'Tapt Kund', 'Mana Village'] },
      { day: 11, title: 'Badrinath to Rishikesh', desc: 'Return journey', highlights: ['Joshimath', 'Scenic stops'] },
      { day: 12, title: 'Departure', desc: 'Transfer to Haridwar/Rishikesh', highlights: ['Farewell', 'Drop-off'] },
    ],
    inclusions: ['All meals (B/L/D)', 'AC transport throughout', 'Hotel/camp accommodation', 'Experienced guide', 'Temple entry fees', 'Medical kit', 'Travel insurance'],
    exclusions: ['Helicopter charges (optional)', 'Personal expenses', 'Tips & gratuities', 'Porter charges'],
    rating: 4.9, reviewCount: 245, isActive: true, isFeatured: true,
  },
  {
    title: 'Do Dham Yatra', subtitle: 'Badrinath & Kedarnath combined',
    description: 'Badrinath & Kedarnath — two of the most sacred Hindu shrines in one unforgettable journey through the Himalayas.',
    location: 'Uttarakhand', duration: '7 Days', basePrice: 28999, category: 'Pilgrimage',
    group: 15, icon: 'Mountain', gradient: 'from-[#2B3A52] via-orange-900 to-orange-600',
    images: ['https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Haridwar Arrival', desc: 'Welcome ceremony', highlights: ['Ganga Aarti'] },
      { day: 2, title: 'Drive to Guptkashi', desc: 'Mountain journey', highlights: ['Valley views'] },
      { day: 3, title: 'Kedarnath Trek', desc: 'Sacred trek', highlights: ['Kedarnath Temple'] },
      { day: 4, title: 'Return to Guptkashi', desc: 'Descent and rest', highlights: ['Local exploration'] },
      { day: 5, title: 'Drive to Badrinath', desc: 'Final dham approach', highlights: ['Scenic drive'] },
      { day: 6, title: 'Badrinath Darshan', desc: 'Temple visit', highlights: ['Badrinath Temple', 'Mana Village'] },
      { day: 7, title: 'Return & Departure', desc: 'Drive back to Haridwar', highlights: ['Farewell'] },
    ],
    inclusions: ['All meals', 'AC transport', 'Hotel stays', 'Guide', 'Entry fees'],
    exclusions: ['Helicopter charges', 'Personal expenses', 'Tips'],
    rating: 4.8, reviewCount: 180, isActive: true, isFeatured: true,
  },
  {
    title: 'Manali & Shimla Escape', subtitle: 'Twin hill station paradise',
    description: 'Twin hill station getaway with snow activities, scenic drives and colonial charm in the heart of Himachal Pradesh.',
    location: 'Himachal Pradesh', duration: '7 Days', basePrice: 22499, category: 'Hill Station',
    group: 25, icon: 'Compass', gradient: 'from-[#2B3A52] via-emerald-900 to-emerald-600',
    images: ['https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Arrival in Shimla', desc: 'Check-in and explore', highlights: ['Mall Road', 'Ridge'] },
      { day: 2, title: 'Shimla Sightseeing', desc: 'Full day tour', highlights: ['Jakhoo Temple', 'Kufri'] },
      { day: 3, title: 'Shimla to Manali', desc: 'Scenic drive', highlights: ['Beas River', 'Valley views'] },
      { day: 4, title: 'Manali Local', desc: 'Explore Old Manali', highlights: ['Hadimba Temple', 'Vashisht Hot Springs'] },
      { day: 5, title: 'Solang Valley', desc: 'Adventure day', highlights: ['Paragliding', 'Snow activities'] },
      { day: 6, title: 'Rohtang Pass', desc: 'High altitude excursion', highlights: ['Snow point', 'Mountain views'] },
      { day: 7, title: 'Departure', desc: 'Transfer to Chandigarh/Delhi', highlights: ['Farewell'] },
    ],
    inclusions: ['Breakfast & dinner', 'AC Volvo/Innova', '3-4 star hotels', 'Sightseeing', 'Guide'],
    exclusions: ['Lunch', 'Adventure activities', 'Rohtang permit fees', 'Personal expenses'],
    rating: 4.8, reviewCount: 320, isActive: true, isFeatured: true,
  },
  {
    title: 'Kerala Backwater Bliss', subtitle: 'God\'s own country experience',
    description: 'Houseboat cruises through serene backwaters, tea plantations and Ayurvedic spa retreats in God\'s own country.',
    location: 'Kerala', duration: '5 Days', basePrice: 18999, category: 'Backwater',
    group: 12, icon: 'Compass', gradient: 'from-[#2B3A52] via-teal-900 to-teal-600',
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Arrival in Kochi', desc: 'Welcome to Kerala', highlights: ['Fort Kochi', 'Chinese fishing nets'] },
      { day: 2, title: 'Munnar Tea Gardens', desc: 'Drive to the hills', highlights: ['Tea museum', 'Spice gardens'] },
      { day: 3, title: 'Thekkady', desc: 'Wildlife and nature', highlights: ['Periyar Lake', 'Elephant camp'] },
      { day: 4, title: 'Alleppey Houseboat', desc: 'Backwater cruise', highlights: ['Houseboat stay', 'Village life'] },
      { day: 5, title: 'Departure from Kochi', desc: 'Transfer to airport', highlights: ['Shopping', 'Farewell'] },
    ],
    inclusions: ['All meals', 'Houseboat with crew', 'AC transport', 'Resort stays', 'Ayurvedic spa session'],
    exclusions: ['Flight tickets', 'Personal expenses', 'Tips'],
    rating: 4.7, reviewCount: 210, isActive: true, isFeatured: true,
  },
  {
    title: 'Golden Triangle Tour', subtitle: 'Delhi, Agra & Jaipur circuit',
    description: 'The iconic circuit covering Taj Mahal, Amber Fort, and the vibrant streets of Old Delhi.',
    location: 'Delhi-Agra-Jaipur', duration: '6 Days', basePrice: 15999, category: 'Heritage',
    group: 30, icon: 'Compass', gradient: 'from-[#2B3A52] via-amber-900 to-amber-600',
    images: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Delhi Arrival', desc: 'Welcome', highlights: ['India Gate', 'Raj Ghat'] },
      { day: 2, title: 'Old & New Delhi', desc: 'Full day tour', highlights: ['Red Fort', 'Qutub Minar', 'Chandni Chowk'] },
      { day: 3, title: 'Delhi to Agra', desc: 'Drive to Agra', highlights: ['Taj Mahal', 'Agra Fort'] },
      { day: 4, title: 'Agra to Jaipur', desc: 'Via Fatehpur Sikri', highlights: ['Fatehpur Sikri', 'Abhaneri Stepwell'] },
      { day: 5, title: 'Jaipur Sightseeing', desc: 'Pink City', highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace'] },
      { day: 6, title: 'Departure', desc: 'Return to Delhi', highlights: ['Shopping', 'Farewell'] },
    ],
    inclusions: ['Breakfast', 'AC Innova', '4-star hotels', 'English-speaking guide', 'Monument entries'],
    exclusions: ['Lunch & dinner', 'Camera fees', 'Personal expenses'],
    rating: 4.6, reviewCount: 290, isActive: true, isFeatured: false,
  },
  {
    title: 'Ladakh Adventure', subtitle: 'Roof of the world expedition',
    description: 'High-altitude expedition through Pangong Lake, Nubra Valley and the world\'s highest motorable roads.',
    location: 'Ladakh', duration: '8 Days', basePrice: 35499, category: 'Adventure',
    group: 15, icon: 'Mountain', gradient: 'from-[#2B3A52] via-blue-900 to-blue-600',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Leh Arrival', desc: 'Acclimatization', highlights: ['Rest day', 'Leh Market'] },
      { day: 2, title: 'Leh Sightseeing', desc: 'Monasteries', highlights: ['Shanti Stupa', 'Leh Palace'] },
      { day: 3, title: 'Nubra Valley', desc: 'Over Khardung La', highlights: ['Khardung La Pass', 'Double-humped camels'] },
      { day: 4, title: 'Nubra to Pangong', desc: 'Scenic drive', highlights: ['Shyok River', 'Pangong Lake'] },
      { day: 5, title: 'Pangong Lake', desc: 'Full day at the lake', highlights: ['Blue waters', 'Chang La Pass'] },
      { day: 6, title: 'Return to Leh', desc: 'Via Chang La', highlights: ['Hemis Monastery'] },
      { day: 7, title: 'Magnetic Hill', desc: 'Excursion', highlights: ['Magnetic Hill', 'Gurudwara Pathar Sahib'] },
      { day: 8, title: 'Departure', desc: 'Fly out of Leh', highlights: ['Farewell'] },
    ],
    inclusions: ['All meals', '4x4 vehicles', 'Camps & hotels', 'Inner Line Permits', 'Oxygen cylinders'],
    exclusions: ['Flight tickets', 'Bike rental', 'Personal gear', 'Tips'],
    rating: 4.9, reviewCount: 150, isActive: true, isFeatured: true,
  },
  {
    title: 'Goa Beach Getaway', subtitle: 'Sun, sand & seafood',
    description: 'Sun-soaked beaches, Portuguese heritage forts, vibrant nightlife and Goan seafood cuisine.',
    location: 'Goa', duration: '4 Days', basePrice: 12999, category: 'Beach',
    group: 20, icon: 'Compass', gradient: 'from-[#2B3A52] via-cyan-900 to-cyan-600',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Goa Arrival', desc: 'Beach check-in', highlights: ['North Goa beaches', 'Shack dinner'] },
      { day: 2, title: 'North Goa Tour', desc: 'Beach hopping', highlights: ['Baga', 'Calangute', 'Anjuna', 'Fort Aguada'] },
      { day: 3, title: 'South Goa & Heritage', desc: 'Culture & beaches', highlights: ['Basilica of Bom Jesus', 'Palolem Beach', 'Spice plantation'] },
      { day: 4, title: 'Departure', desc: 'Free morning, transfer', highlights: ['Shopping', 'Farewell'] },
    ],
    inclusions: ['Breakfast', 'AC car', 'Beach resort', 'Sightseeing tour', 'Water sports (1 activity)'],
    exclusions: ['Lunch & dinner', 'Additional water sports', 'Nightclub entries', 'Personal expenses'],
    rating: 4.5, reviewCount: 380, isActive: true, isFeatured: false,
  },
  {
    title: 'Rishikesh & Haridwar Spiritual', subtitle: 'Yoga, meditation & Ganga Aarti',
    description: 'Yoga, meditation, Ganga Aarti, white-water rafting and the spiritual energy of the holy cities.',
    location: 'Uttarakhand', duration: '4 Days', basePrice: 11499, category: 'Spiritual',
    group: 20, icon: 'Compass', gradient: 'from-[#2B3A52] via-purple-900 to-purple-600',
    images: ['https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Haridwar Arrival', desc: 'Check-in', highlights: ['Ganga Aarti at Har Ki Pauri'] },
      { day: 2, title: 'Rishikesh', desc: 'Adventure & spirituality', highlights: ['Laxman Jhula', 'Rafting', 'Yoga session'] },
      { day: 3, title: 'Rishikesh Full Day', desc: 'Deep dive', highlights: ['Bungee jumping', 'Beatles Ashram', 'Triveni Ghat Aarti'] },
      { day: 4, title: 'Departure', desc: 'Transfer to Dehradun/Delhi', highlights: ['Farewell'] },
    ],
    inclusions: ['All meals', 'Rafting', 'Yoga session', 'Hotel/camp', 'Transport'],
    exclusions: ['Bungee jumping (optional)', 'Personal expenses', 'Tips'],
    rating: 4.7, reviewCount: 195, isActive: true, isFeatured: false,
  },
  {
    title: 'Darjeeling & Gangtok', subtitle: 'Tea gardens & monasteries',
    description: 'Toy train rides, Kanchenjunga sunrises, Buddhist monasteries and world-famous tea gardens.',
    location: 'West Bengal & Sikkim', duration: '6 Days', basePrice: 19999, category: 'Hill Station',
    group: 18, icon: 'Mountain', gradient: 'from-[#2B3A52] via-lime-900 to-lime-600',
    images: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=800&fit=crop'],
    itinerary: [
      { day: 1, title: 'Bagdogra to Darjeeling', desc: 'Mountain drive', highlights: ['Tea garden views'] },
      { day: 2, title: 'Tiger Hill Sunrise', desc: 'Early morning', highlights: ['Kanchenjunga sunrise', 'Batasia Loop', 'Toy Train'] },
      { day: 3, title: 'Darjeeling Local', desc: 'Explore the town', highlights: ['Tea factory', 'Monastery', 'Mall Road'] },
      { day: 4, title: 'Darjeeling to Gangtok', desc: 'Drive to Sikkim', highlights: ['Tembi Viewpoint'] },
      { day: 5, title: 'Gangtok Sightseeing', desc: 'Full day', highlights: ['Tsomgo Lake', 'Nathula Pass', 'MG Marg'] },
      { day: 6, title: 'Departure', desc: 'Drive to Bagdogra', highlights: ['Farewell'] },
    ],
    inclusions: ['Breakfast & dinner', 'AC vehicle', '3-star hotels', 'Tsomgo Lake permit', 'Guide'],
    exclusions: ['Lunch', 'Nathula Pass permit (extra)', 'Toy train tickets', 'Personal expenses'],
    rating: 4.7, reviewCount: 165, isActive: true, isFeatured: false,
  },
];

// ── Hotels Data ──
const hotelsData = [
  { name: 'The Serenity River Resort', location: 'Rishikesh', slug: 'serenity-river-rishikesh', type: 'Resort', pricePerNight: 4999, rating: 4.8, reviewCount: 320, images: [{ url: 'https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=600&h=800&fit=crop', alt: 'Serenity River Resort' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Pool'], features: ['Riverside location', 'Ganga views', 'Yoga deck', 'Spa'], description: 'Riverside luxury resort with Ganga views, spa & yoga decks', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 10 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 6 }, { type: 'Suite', priceMultiplier: 1.8, available: 3 }] },
  { name: 'Himalayan View Retreat', location: 'Manali', slug: 'himalayan-view-manali', type: 'Resort', pricePerNight: 5499, rating: 4.7, reviewCount: 280, images: [{ url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&h=800&fit=crop', alt: 'Himalayan View Retreat' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Heated Pool'], features: ['Snow views', 'Mountain trails', 'Bonfire area'], description: 'Snow-view rooms with heated pools and mountain trails', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 8 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 5 }, { type: 'Suite', priceMultiplier: 1.8, available: 2 }] },
  { name: 'Casa de Goa Beach Resort', location: 'Goa', slug: 'casa-de-goa', type: 'Resort', pricePerNight: 3999, rating: 4.6, reviewCount: 450, images: [{ url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop', alt: 'Casa de Goa' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Beach Access'], features: ['Beachfront', 'Infinity pool', 'Beach shacks'], description: 'Beachfront property with infinity pool and beach shacks', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 15 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 8 }, { type: 'Suite', priceMultiplier: 1.8, available: 4 }] },
  { name: 'Kerala Backwater Villa', location: 'Kerala', slug: 'kerala-backwater-villa', type: 'Villa', pricePerNight: 6499, rating: 4.9, reviewCount: 190, images: [{ url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop', alt: 'Kerala Backwater Villa' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Houseboat'], features: ['Private villa', 'Backwater access', 'Ayurvedic spa'], description: 'Private villa on the backwaters with houseboat access', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 4 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 3 }, { type: 'Suite', priceMultiplier: 1.8, available: 2 }] },
  { name: 'Heritage Haveli Jaipur', location: 'Jaipur', slug: 'heritage-haveli-jaipur', type: 'Heritage', pricePerNight: 5999, rating: 4.8, reviewCount: 340, images: [{ url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=800&fit=crop', alt: 'Heritage Haveli' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Heritage Tour'], features: ['18th-century architecture', 'Rooftop fort views', 'Royal dining'], description: 'Restored 18th-century haveli with rooftop fort views', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 8 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 5 }, { type: 'Suite', priceMultiplier: 1.8, available: 3 }] },
  { name: 'Darjeeling Tea Garden Stay', location: 'Darjeeling', slug: 'darjeeling-tea-garden', type: 'Boutique', pricePerNight: 3499, rating: 4.7, reviewCount: 210, images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop', alt: 'Tea Garden Stay' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Tea Tours'], features: ['Tea garden setting', 'Kanchenjunga views', 'Colonial charm'], description: 'Colonial bungalow amidst tea gardens with Kanchenjunga views', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 6 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 4 }] },
  { name: 'Ganga Heritage Hotel', location: 'Rishikesh', slug: 'ganga-heritage', type: 'Heritage', pricePerNight: 3499, rating: 4.5, reviewCount: 180, images: [{ url: 'https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=600&h=800&fit=crop', alt: 'Ganga Heritage' }], amenities: ['WiFi', 'Parking', 'Restaurant'], features: ['Near Triveni Ghat', 'Rooftop dining', 'Heritage decor'], description: 'Boutique heritage hotel near Triveni Ghat with rooftop dining', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 12 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 6 }] },
  { name: 'Solang Valley Lodge', location: 'Manali', slug: 'solang-valley-lodge', type: 'Lodge', pricePerNight: 4299, rating: 4.6, reviewCount: 240, images: [{ url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&h=800&fit=crop', alt: 'Solang Valley Lodge' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Ski Access'], features: ['Near Solang', 'Adventure hub', 'Bonfire area'], description: 'Adventure lodge near Solang with ski-in access and bonfire area', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 10 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 5 }] },
  { name: 'Anjuna Beach House', location: 'Goa', slug: 'anjuna-beach-house', type: 'Boutique', pricePerNight: 2999, rating: 4.4, reviewCount: 380, images: [{ url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop', alt: 'Anjuna Beach House' }], amenities: ['WiFi', 'Restaurant', 'Beach Access'], features: ['Portuguese style', 'Near Anjuna Market', 'Garden courtyard'], description: 'Portuguese-style beach house near Anjuna Flea Market', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 8 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 4 }] },
  { name: 'Munnar Tea Estate Bungalow', location: 'Kerala', slug: 'munnar-tea-estate', type: 'Villa', pricePerNight: 5499, rating: 4.8, reviewCount: 160, images: [{ url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop', alt: 'Munnar Tea Estate' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Tea Tours'], features: ['Working tea estate', 'Colonial-era', 'Guided tours'], description: 'Colonial-era bungalow on a working tea estate with guided tours', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 4 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 3 }, { type: 'Suite', priceMultiplier: 1.8, available: 2 }] },
  { name: 'Pink City Palace Hotel', location: 'Jaipur', slug: 'pink-city-palace', type: 'Luxury', pricePerNight: 7999, rating: 4.9, reviewCount: 420, images: [{ url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=800&fit=crop', alt: 'Pink City Palace' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Spa', 'Pool'], features: ['5-star luxury', 'Jantar Mantar views', 'Royal spa'], description: '5-star palace hotel with Jantar Mantar views and royal spa', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 20 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 10 }, { type: 'Suite', priceMultiplier: 1.8, available: 5 }] },
  { name: 'Tiger Hill Resort', location: 'Darjeeling', slug: 'tiger-hill-resort', type: 'Resort', pricePerNight: 4499, rating: 4.6, reviewCount: 175, images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop', alt: 'Tiger Hill Resort' }], amenities: ['WiFi', 'Parking', 'Restaurant', 'Heated Floors'], features: ['Sunrise views', 'Kanchenjunga facing', 'Mountain trails'], description: 'Sunrise-view rooms facing Kanchenjunga with heated floors', rooms: [{ type: 'Standard', priceMultiplier: 1, available: 8 }, { type: 'Deluxe', priceMultiplier: 1.3, available: 5 }] },
];

// ── Destinations Data ──
const destinationsData = [
  { name: 'Rishikesh', slug: 'rishikesh', category: 'Spiritual', description: 'The yoga capital of the world, nestled on the banks of the holy Ganges.', images: ['https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=600&h=800&fit=crop'], rating: 4.7, priceFrom: 3499 },
  { name: 'Manali', slug: 'manali', category: 'Hill Station', description: 'A breathtaking Himalayan town surrounded by snow-capped mountains and pine forests.', images: ['https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&h=800&fit=crop'], rating: 4.7, priceFrom: 4299 },
  { name: 'Goa', slug: 'goa', category: 'Beach', description: 'India\'s most popular beach destination with Portuguese heritage and vibrant nightlife.', images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop'], rating: 4.5, priceFrom: 2999 },
  { name: 'Kerala', slug: 'kerala', category: 'Backwater', description: 'God\'s own country — a land of backwaters, tea gardens, and Ayurvedic traditions.', images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop'], rating: 4.8, priceFrom: 5499 },
  { name: 'Jaipur', slug: 'jaipur', category: 'Heritage', description: 'The Pink City — a royal blend of history, culture, and architectural marvels.', images: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=800&fit=crop'], rating: 4.7, priceFrom: 5999 },
  { name: 'Darjeeling', slug: 'darjeeling', category: 'Hill Station', description: 'The Queen of Hills — famous for tea, toy trains, and Kanchenjunga views.', images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop'], rating: 4.6, priceFrom: 3499 },
  { name: 'Ladakh', slug: 'ladakh', category: 'Adventure', description: 'The land of high passes — an otherworldly landscape of mountains and monasteries.', images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop'], rating: 4.9, priceFrom: 35499 },
  { name: 'Uttarakhand', slug: 'uttarakhand', category: 'Pilgrimage', description: 'Land of the gods — home to Chardham, sacred rivers, and Himalayan spirituality.', images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=800&fit=crop'], rating: 4.8, priceFrom: 11499 },
];

// ── Seed Function ──
const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...\n');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Package.deleteMany({}),
      Hotel.deleteMany({}),
      Destination.deleteMany({}),
      PriceConfig.deleteMany({}),
    ]);
    console.log('Cleared existing collections.\n');

    // Create admin user
    const adminPassword = 'Admin@123';
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@wandernest.in',
      passwordHash: adminPassword,
      role: 'admin',
      isEmailVerified: true,
    });
    console.log(`Admin user created: ${admin.email}`);

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@wandernest.in',
      passwordHash: 'Demo@1234',
      role: 'user',
      isEmailVerified: true,
    });
    console.log(`Demo user created: ${demoUser.email}\n`);

    // Seed packages
    const packages = await Package.insertMany(packagesData);
    console.log(`Seeded ${packages.length} packages.`);

    // Seed hotels
    const hotels = await Hotel.insertMany(hotelsData);
    console.log(`Seeded ${hotels.length} hotels.`);

    // Seed destinations with linked packages/hotels
    const destWithLinks = destinationsData.map((d) => {
      const linkedPkgs = packages.filter((p) =>
        p.location.toLowerCase().includes(d.slug) || d.name.toLowerCase().includes(p.location.toLowerCase().split(' ')[0])
      ).map((p) => p._id);
      const linkedHtls = hotels.filter((h) =>
        h.slug.includes(d.slug)
      ).map((h) => h._id);
      return { ...d, linkedPackages: linkedPkgs, linkedHotels: linkedHtls };
    });

    const destinations = await Destination.insertMany(destWithLinks);
    console.log(`Seeded ${destinations.length} destinations.`);

    // Seed price config
    await PriceConfig.create({
      packages: packages.map((p) => ({ packageId: p._id, basePrice: p.basePrice })),
      roomTypes: [
        { id: 'standard', name: 'Standard Room', multiplier: 1, desc: 'Comfortable twin/double sharing' },
        { id: 'deluxe', name: 'Deluxe Room', multiplier: 1.3, desc: 'Premium room with valley views' },
        { id: 'suite', name: 'Luxury Suite', multiplier: 1.8, desc: 'Spacious suite with private balcony' },
        { id: 'camp', name: 'Premium Camp', multiplier: 0.85, desc: 'Luxury tent/camp accommodation' },
      ],
      addons: [
        { id: 'meals', name: 'Premium Meal Plan', price: 3500, icon: 'Utensils', desc: 'All meals included (B/L/D + snacks)' },
        { id: 'excursion', name: 'Extra Excursions', price: 5000, icon: 'Compass', desc: 'Additional sightseeing spots beyond itinerary' },
        { id: 'photography', name: 'Photography Package', price: 7500, icon: 'Camera', desc: 'Professional photographer for 2 days' },
        { id: 'helicopter', name: 'Helicopter Transfer', price: 25000, icon: 'Mountain', desc: 'Helicopter ride for mountain segments' },
        { id: 'spa', name: 'Spa & Wellness', price: 4500, icon: 'BedDouble', desc: 'Ayurvedic spa sessions (2 sessions)' },
        { id: 'guide', name: 'Private Guide', price: 6000, icon: 'MapPin', desc: 'Dedicated English-speaking guide throughout' },
      ],
    });
    console.log('Seeded price calculator config.\n');

    console.log('═══════════════════════════════════');
    console.log('  Database seeded successfully!');
    console.log('═══════════════════════════════════');
    console.log(`  Admin: admin@wandernest.in / Admin@123`);
    console.log(`  User:  demo@wandernest.in  / Demo@1234`);
    console.log(`  ${packages.length} packages, ${hotels.length} hotels, ${destinations.length} destinations`);
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
