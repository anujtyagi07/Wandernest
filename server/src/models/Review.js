import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    package: { type: Schema.Types.ObjectId, ref: 'Package', sparse: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', sparse: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '', trim: true },
    comment: { type: String, default: '', maxlength: 1000 },
    isApproved: { type: Boolean, default: false },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ package: 1, isApproved: 1 });
reviewSchema.index({ hotel: 1, isApproved: 1 });

// Update average rating on approval
reviewSchema.post('save', async function () {
  if (!this.isApproved) return;

  if (this.package) {
    const Package = model('Package');
    const stats = await this.constructor.aggregate([
      { $match: { package: this.package, isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Package.findByIdAndUpdate(this.package, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }
  }

  if (this.hotel) {
    const Hotel = model('Hotel');
    const stats = await this.constructor.aggregate([
      { $match: { hotel: this.hotel, isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Hotel.findByIdAndUpdate(this.hotel, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }
  }
});

const Review = model('Review', reviewSchema);
export default Review;
