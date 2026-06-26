import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true, maxlength: 2000 },
    status: { type: String, enum: ['new', 'in-progress', 'resolved', 'closed'], default: 'new' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', sparse: true },
    adminNotes: [{
      note: { type: String },
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

contactSchema.index({ status: 1, createdAt: -1 });

const Contact = model('Contact', contactSchema);
export default Contact;
