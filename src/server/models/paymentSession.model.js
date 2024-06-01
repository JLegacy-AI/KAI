import * as mongoose from "mongoose";

const paymentSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    paid: { type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

// Enable virtuals (fake fields created on the fly, but not stored in the database) in order to create id field from _id
paymentSessionSchema.set("toJSON", {
  virtuals: true,
});

const paymentSessionModel =
  mongoose?.models?.PaymentSession ||
  mongoose.model("PaymentSession", paymentSessionSchema);

export default paymentSessionModel;
