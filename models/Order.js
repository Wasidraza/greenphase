import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  merchantOrderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  productTitle: { 
    type: String, 
    required: true 
  },
  productColor: {
    type: String,
    default: "Standard"
  },
  power: {
    type: String,
    default: "-"
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING' 
  },
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
  paymentDetails: mongoose.Schema.Types.Mixed, 
  errorCode: String,
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
OrderSchema.index({ merchantOrderId: 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);