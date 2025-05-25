import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
const midtransClient = require('midtrans-client');

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const { cartProducts, address } = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const newOrderId = new mongoose.Types.ObjectId().toString();

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    cartProducts,
    orderId: new mongoose.Types.ObjectId().toString(),
    paid: false,
  });

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

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

  const midtransParams = {
    transaction_details: {
      order_id: newOrderId,
      gross_amount: calculateTotalAmount(midtransItems),
    },
    item_details: midtransItems,
    credit_card: { secure: true },
    customer_details: { email: userEmail },
    callbacks: {
      finish: `${process.env.NEXTAUTH_URL}/orders/${orderDoc._id}?clear-cart=1`,
      error: `${process.env.NEXTAUTH_URL}/cart?canceled=1`,
    },
  };

  try {
    const midtransTransaction = await snap.createTransaction(midtransParams);
    return Response.json({
      redirect_url: midtransTransaction.redirect_url,
      token: midtransTransaction.token,
    });
  } catch (error) {
    console.error("Midtrans error:", error);
    return Response.json({ error: "Failed to create Midtrans transaction" }, { status: 500 });
  }
}

function calculateTotalAmount(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}


