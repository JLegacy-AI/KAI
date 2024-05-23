import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6, select: false }, // select: false means that the password field will not be returned in the query results
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatSession" }],
    totalTokensUsed: { type: Number, default: 0 }, // Total tokens used by the user in its lifetime
    tokensGranted: { type: Number, default: 0 }, // Tokens granted to the user
    tokensUsed: { type: Number, default: 0 }, // Tokens used out of the granted tokens
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
