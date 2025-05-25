import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  try {
    const body = await req.json();
    const orderId = body?.order_id;
    const transactionStatus = body?.transaction_status;

    if (!orderId || !transactionStatus) {
      console.error("Invalid payload from Midtrans");
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    if (transactionStatus === "pending") {
      console.log("Payment is pending");
      // Bisa update status ke pending kalau perlu
    } else if (transactionStatus === "settlement") {
      console.log("Payment is settled");
      await Order.updateOne({ orderId: orderId }, { paid: true });
    } else if (transactionStatus === "deny") {
      console.log("Payment is denied");
      // Update status jadi denied kalo kamu pake status custom
    } else {
      console.log("Unhandled transaction status:", transactionStatus);
    }

    return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
