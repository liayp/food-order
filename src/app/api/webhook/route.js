import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const payload = await req.json();
    const orderId = payload?.order_id;
    const paymentStatus = payload?.transaction_status;

    if (!orderId || !paymentStatus) {
      console.error('Invalid payload from Midtrans');
      return new Response('Invalid payload from Midtrans', { status: 400 });
    }

    await mongoose.connect(process.env.MONGO_URL);

    if (paymentStatus === 'settlement') {
      // Update paid jadi true kalo payment sukses
      await Order.updateOne({ orderId }, { paid: true });
      console.log(`Order ${orderId} marked as paid`);
    } else if (paymentStatus === 'pending') {
      console.log(`Order ${orderId} payment is pending`);
    } else if (paymentStatus === 'deny') {
      console.log(`Order ${orderId} payment denied`);
    } else {
      console.log(`Order ${orderId} payment status: ${paymentStatus}`);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Midtrans webhook error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
