import { Schema, model } from 'mongoose';

const destinationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, default: '' },
    description: { type: String, default: '' },
    images: [{ type: String }],
    gradient: { type: String, default: '' },
    icon: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    priceFrom: { type: Number, default: 0 },
    linkedPackages: [{ type: Schema.Types.ObjectId, ref: 'Package' }],
    linkedHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

destinationSchema.index({ category: 1 });
destinationSchema.index({ name: 'text', description: 'text' });

const Destination = model('Destination', destinationSchema);
export default Destination;
