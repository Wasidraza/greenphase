// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  merchantOrderId: { type: String, required: true, unique: true },
  productTitle: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
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
  phonepeOrderId: String,
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);