import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IChat extends Document {
  name: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "Authentication", required: true },
  },
  { timestamps: true }
);

const ChatModel = models.Chat || model<IChat>("Chat", chatSchema);
export default ChatModel;