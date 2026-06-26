import { Schema, model } from 'mongoose';

const otpSchema = new Schema(
  {
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ['booking-verify'], default: 'booking-verify' },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// TTL index on expiresAt auto-deletes expired OTPs via MongoDB's TTL monitor

const Otp = model('Otp', otpSchema);
export default Otp;
