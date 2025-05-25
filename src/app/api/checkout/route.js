import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
const midtransClient = require("midtrans-client");

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const { cartProducts, address } = await req.json();

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // Buat order di database (tanpa orderId dulu)
  const orderDoc = await Order.create({
    userEmail,
    ...address,
    cartProducts,
    paid: false,
  });

  // Update orderId dengan _id.toString()
  await Order.updateOne(
    { _id: orderDoc._id },
    { orderId: orderDoc._id.toString() }
  );

  // Setup Midtrans Snap
  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  // Siapin item detail untuk Midtrans
  const midtransItems = [];
  for (const cartProduct of cartProducts) {
    const productInfo = await MenuItem.findById(cartProduct._id);
    let productPrice = productInfo.basePrice;

    for (const extra of cartProduct.extras) {
      productPrice += extra.price;
    }

    if (cartProduct.size) {
      productPrice += cartProduct.size.price;
    }

    midtransItems.push({
      id: cartProduct._id.toString(),
      name: cartProduct.name,
      price: productPrice,
      quantity: 1,
    });
  }

  const transactionDetails = {
    order_id: orderDoc._id.toString(),
    gross_amount: calculateTotalAmount(midtransItems),
  };

  const customerDetails = {
    email: userEmail,
  };

  const midtransParams = {
    transaction_details: transactionDetails,
    item_details: midtransItems,
    credit_card: { secure: true },
    customer_details: customerDetails,
    callbacks: {
      finish: process.env.NEXTAUTH_URL + 'orders/' + orderDoc._id.toString() + '?clear-cart=1',
      error: process.env.NEXTAUTH_URL + 'cart?canceled=1',
    },
  };

  try {
    const transaction = await snap.createTransaction(midtransParams);
    return Response.json(transaction.redirect_url);
  } catch (error) {
    console.error("Midtrans error:", error);
    return Response.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}

function calculateTotalAmount(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

const redirectUrl = await res.json();
if (redirectUrl) {
  window.location.href = redirectUrl; // 🔁 redirect ke Midtrans
}