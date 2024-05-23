import * as mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Chat Session",
    },
    messages: [
      {
        message: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["user", "ai"],
          default: "ai",
        },
        tokensUsed: {
          type: Number,
          default: 0,
        },
        usage: {
          // This field stores amount of tokens spent on this message
          inputTokens: {
            type: Number,
            default: 0,
          },
          outputTokens: {
            type: Number,
            default: 0,
          },
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// FIXME doesn't work, Maybe just delete the chat id in the function that deletes the chat session
// Delete the chat session from user's chats array when the chat session is deleted
chatSessionSchema.post(
  "deleteOne",
  { document: true, query: false },
  function (doc) {
    console.log("[chatSessionModel] Delete One Hook Ran...", doc, this._id);
    /*
    const updatedUser = await mongoose
      .model("User")
      .updateOne({ _id: doc.user }, { $pull: { chats: doc._id } });
    */
    console.log("[chatSessionModel-deleteOne] Deleted: ", updatedUser);
  }
);

// Enable virtuals (fake fields created on the fly, but not stored in the database) in order to create id field from _id
chatSessionSchema.set("toJSON", {
  virtuals: true,
});



const chatSessionModel =
  mongoose?.models?.ChatSession ||
  mongoose.model("ChatSession", chatSessionSchema);

export default chatSessionModel;
