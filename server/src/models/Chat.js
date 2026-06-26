import { Schema, model } from 'mongoose';

const chatSchema = new Schema(
  {
    participants: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['booker', 'owner'], required: true },
      name: { type: String, required: true },
    }],
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    lastMessage: {
      text: { type: String },
      sender: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

chatSchema.index({ 'participants.user': 1 });
chatSchema.index({ booking: 1 });

const Chat = model('Chat', chatSchema);
export default Chat;
