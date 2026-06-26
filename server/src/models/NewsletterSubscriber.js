import { Schema, model } from 'mongoose';

const newsletterSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isSubscribed: { type: Boolean, default: true },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true }
);

const NewsletterSubscriber = model('NewsletterSubscriber', newsletterSchema);
export default NewsletterSubscriber;
