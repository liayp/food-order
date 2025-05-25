import { Order } from "@/models/Order";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let body = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch {
        console.warn("⚠️ Webhook body is not JSON:", text);
        return new Response("Unsupported format", { status: 400 });
      }
    }

    console.log("🔥 Webhook Payload:", body);

    const orderId = body.order_id || body.transaction_id || body.orderId;
    const transactionStatus = body.transaction_status;

    if (!orderId || !transactionStatus) {
      console.error("Invalid payload from Midtrans:", body);
      return new Response("Invalid payload", { status: 400 });
    }

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    console.log(`Webhook received: orderId=${orderId}, status=${transactionStatus}`);

    if (transactionStatus === "settlement") {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paid: true },
        { new: true }
      );

      if (updatedOrder) {
        console.log("✅ Order payment status updated:", updatedOrder);
      } else {
        console.warn("⚠️ Order not found for id:", orderId);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Midtrans webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

