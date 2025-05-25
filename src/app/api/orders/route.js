import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

mongoose.set("strictQuery", false);

export async function GET(req) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const admin = await isAdmin();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    if (_id) {
      const order = await Order.findById(_id);
      return new Response(JSON.stringify(order), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (admin) {
      const orders = await Order.find();
      return new Response(JSON.stringify(orders), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (userEmail) {
      const orders = await Order.find({ userEmail });
      return new Response(JSON.stringify(orders), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Unauthorized", { status: 401 });
  } catch (error) {
    console.error("GET orders error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { orderId, paymentStatus } = await req.json();

    if (!orderId || paymentStatus === undefined) {
      return new Response(
        JSON.stringify({ error: "orderId or paymentStatus missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paid: paymentStatus },
      { new: true }
    );

    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST update order error:", error);
    return new Response(JSON.stringify({ error: "Failed to update payment status" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
