import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
const midtransClient = require("midtrans-client");

mongoose.set("strictQuery", false);

async function calculateTotalAmount(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export async function POST(req) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { cartProducts, address } = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const orderDoc = await Order.create({
      userEmail,
      ...address,
      cartProducts,
      paid: false,
    });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const midtransItems = [];

    for (const cartProduct of cartProducts) {
      const productInfo = await MenuItem.findById(cartProduct._id);
      if (!productInfo) continue;

      let productPrice = productInfo.basePrice;

      if (cartProduct.extras?.length) {
        productPrice += cartProduct.extras.reduce((sum, extra) => sum + extra.price, 0);
      }

      if (cartProduct.size?.price) {
        productPrice += cartProduct.size.price;
      }

      midtransItems.push({
        id: cartProduct._id.toString(),
        name: cartProduct.name,
        price: productPrice,
        quantity: cartProduct.quantity || 1,
      });
    }

    const grossAmount = await calculateTotalAmount(midtransItems);

    const midtransParams = {
      transaction_details: {
        order_id: orderDoc._id.toString(),
        gross_amount: grossAmount,
      },
      item_details: midtransItems,
      customer_details: {
        email: userEmail,
      },
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/orders/${orderDoc._id}?clear-cart=1`,
        error: `${process.env.NEXTAUTH_URL}/cart?canceled=1`,
      },
      notification_url: `https://2dd1-103-41-78-253.ngrok-free.app/api/webhook`,
    };

    console.log("Midtrans Params:", JSON.stringify(midtransParams, null, 2));

    const transaction = await snap.createTransaction(midtransParams);

    console.log("Midtrans Transaction Response:", transaction);


    return new Response(JSON.stringify({ redirect_url: transaction.redirect_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: "Transaction failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
