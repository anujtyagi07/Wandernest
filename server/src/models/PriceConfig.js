import { Schema, model } from 'mongoose';

const priceConfigSchema = new Schema(
  {
    packages: [{
      packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
      basePrice: { type: Number, required: true },
    }],
    roomTypes: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      multiplier: { type: Number, required: true },
      desc: { type: String, default: '' },
    }],
    addons: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      icon: { type: String, default: '' },
      desc: { type: String, default: '' },
    }],
  },
  { timestamps: true }
);

const PriceConfig = model('PriceConfig', priceConfigSchema);
export default PriceConfig;
