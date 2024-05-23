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
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Enable virtuals (fake fields created on the fly, but not stored in the database) in order to create id field from _id
userSchema.set("toJSON", {
  virtuals: true,
});

/*
userSchema.virtual("remainingTokens").get(function () {
  return this.tokensGranted - this.totalTokensUsed;
});
*/

// Whenever tokensUsed is updated, update the totalTokensUsed field as well
/*
userSchema.pre("save", function (next) {
  console.log(
    `[userModel-PreSave], TotalTokensUsed: ${this.totalTokensUsed}, TokensUsed: ${this.tokensUsed}`
  );
  this.totalTokensUsed += this.tokensUsed;
  next();
});
*/

const userModel = mongoose?.models?.User || mongoose.model("User", userSchema);

export default userModel;
