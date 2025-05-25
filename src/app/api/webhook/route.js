const midtransClient = require('midtrans-client');
const { Order } = require('@/models/Order');

export async function POST(req) {
  try {
    const requestBody = await req.json();
    const orderId = requestBody?.orderId;
    const paymentStatus = requestBody?.payment_status;

    if (!orderId || !paymentStatus) {
      console.error('Invalid payload from Midtrans');
      return Response.json('Invalid payload from Midtrans', { status: 400 });
    }

    // Handle the payment status from Midtrans
    if (paymentStatus === 'pending') {
      console.log('Payment is pending');
      // Handle pending status if needed
    } else if (paymentStatus === 'settlement') {
      console.log('Payment is settled');
      // Handle settled status, for example, mark the order as paid
      await Order.updateOne({ orderId }, { paid: true });
    } else if (paymentStatus === 'deny') {
      console.log('Payment is denied');
      // Handle denied status if needed
    } else {
      console.log('Unknown payment status');
      // Handle other payment statuses if needed
    }

    return Response.json('ok', { status: 200 });
  } catch (error) {
    console.error('Midtrans webhook error', error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}