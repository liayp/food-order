import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  orderId: { type: String, unique: true },
  userEmail: String,
  phone: String,
  streetAddress: String,
  postalCode: String,
  city: String,
  country: String,
  cartProducts: Array,
  paid: {type: Boolean, default: false},
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);