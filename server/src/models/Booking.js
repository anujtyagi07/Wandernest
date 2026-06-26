import { Schema, model } from 'mongoose';

const bookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingType: { type: String, enum: ['package', 'hotel'], required: true },
    package: { type: Schema.Types.ObjectId, ref: 'Package', sparse: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', sparse: true },
    traveler: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, required: true },
    },
    travelDate: { type: Date, required: true },
    adults: { type: Number, required: true, min: 1, default: 2 },
    children: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    paymentId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    otpVerified: { type: Boolean, default: false },
    receiptUrl: { type: String, default: '' },
    specialRequests: { type: String, default: '' },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingType: 1, package: 1 });
bookingSchema.index({ bookingType: 1, hotel: 1 });

const Booking = model('Booking', bookingSchema);
export default Booking;
