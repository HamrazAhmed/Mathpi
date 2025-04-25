import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IChatHistory extends Document {
  sender: mongoose.Types.ObjectId;
  text?: string;
  imageUrl?: string;
  chatId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatHistorySchema = new Schema<IChatHistory>(
  { 
    sender: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    chatId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const ChatHistoryModel = models.ChatHistory || model<IChatHistory>("ChatHistory", chatHistorySchema);
export default ChatHistoryModel;