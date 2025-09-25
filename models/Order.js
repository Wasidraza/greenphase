import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  merchantOrderId: { type: String, required: true, unique: true },
  phonepeOrderId: { type: String },
  productTitle: { type: String, required: true },
  productColor: { type: String },
  amount: { type: Number, required: true },
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
