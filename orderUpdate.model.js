import mongoose from 'mongoose';

const orderUpdateSchema = new mongoose.Schema({
    orderID: { type: String, required: true },
    updatedBy: { type: String, required: true }, // admin email or id
    status: {
        type: String,
        enum: ['cancelled', 'delivered', 'completed', 'paused', 'pended'],
        required: true
    },
    notes: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

const OrderUpdate = mongoose.model('OrderUpdate', orderUpdateSchema);

export default OrderUpdate;
