import * as mongoose from "mongoose";

const botSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    // accessType can be "public" or "private"
    accessType: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    trainingTokenCount: { type: Number, default: 0 }, // Number of tokens the bot has trained on
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Enable virtuals (fake fields created on the fly, but not stored in the database) in order to create id field from _id
botSchema.set("toJSON", {
  virtuals: true,
});

const botModel = mongoose?.models?.Bot || mongoose.model("Bot", botSchema);

export default botModel;
