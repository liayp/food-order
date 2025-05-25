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

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    cartProducts,
    paid: false,
  });

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  const midtransItems = [];
  for (const cartProduct of cartProducts) {
    const productInfo = await MenuItem.findById(cartProduct._id);
    let productPrice = productInfo.basePrice;

    // Tambahkan harga bahan tambahan ekstra
    console.log(cartProduct)
    for (const extra of cartProduct.extras) {
      productPrice += extra.price;
    }

    // Tambahkan harga variasi ukuran
    if (cartProduct.size) {
      productPrice += cartProduct.size.price;
    }

    const productName = cartProduct.name;

    midtransItems.push({
      id: cartProduct._id.toString(),
      name: productName,
      price: productPrice,
      quantity: 1,
    });
  }

  const transactionDetails = {
    order_id: orderDoc._id.toString(),
    gross_amount: calculateTotalAmount(midtransItems),
  };

  const creditCardOptions = {
    secure: true,
  };

  const customerDetails = {
    email: userEmail,
  };

  const midtransParams = {
    transaction_details: transactionDetails,
    item_details: midtransItems,
    credit_card: creditCardOptions,
    customer_details: customerDetails,
    callbacks: {
      finish: process.env.NEXTAUTH_URL + 'orders/' + orderDoc._id.toString() + '?clear-cart=1',
      error: process.env.NEXTAUTH_URL + 'cart?canceled=1',
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
    return Response.json({ error: "Failed to create Midtrans transaction" });
  }
}

function calculateTotalAmount(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}


