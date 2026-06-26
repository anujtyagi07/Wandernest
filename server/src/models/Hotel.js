import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
  type: { type: String, required: true },
  priceMultiplier: { type: Number, default: 1 },
  available: { type: Number, default: 5 },
}, { _id: false });

const hotelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    type: { type: String, default: 'Resort' },
    description: { type: String, default: '' },
    pricePerNight: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    images: [{
      url: { type: String, required: true },
      alt: { type: String, default: '' },
    }],
    amenities: [{ type: String }],
    features: [{ type: String }],
    rooms: [roomSchema],
    geo: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

hotelSchema.index({ location: 1, pricePerNight: 1 });
hotelSchema.index({ name: 'text', description: 'text' });

const Hotel = model('Hotel', hotelSchema);
export default Hotel;
