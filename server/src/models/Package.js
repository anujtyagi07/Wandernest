import { Schema, model } from 'mongoose';

const itineraryDaySchema = new Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  highlights: [{ type: String }],
}, { _id: false });

const packageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    category: { type: String, default: '' },
    group: { type: Number, default: 12 },
    icon: { type: String, default: '' },
    gradient: { type: String, default: '' },
    images: [{ type: String }],
    itinerary: [itineraryDaySchema],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

packageSchema.index({ location: 1, category: 1 });
packageSchema.index({ title: 'text', description: 'text' });

const Package = model('Package', packageSchema);
export default Package;
