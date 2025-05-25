import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');

  if (_id) {
    // Mengambil data order berdasarkan _id
    const order = await Order.findById(_id);

    // Memberikan respons dengan data order
    return Response.json(order);
  }

  if (admin) {
    // Jika admin, kembalikan semua data order
    const orders = await Order.find();
    return Response.json(orders);
  }

  if (userEmail) {
    // Jika bukan admin, kembalikan data order berdasarkan userEmail
    const orders = await Order.find({ userEmail });
    return Response.json(orders);
  }
}

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  const { orderId, paymentStatus } = await req.json();

  try {
    // Mengupdate status pembayaran (paid) berdasarkan orderId
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paid: paymentStatus },
      { new: true } // Mengembalikan dokumen yang sudah diupdate
    );

    // Jika berhasil diupdate, kembalikan respons dengan data order yang sudah diupdate
    return Response.json(updatedOrder);
  } catch (error) {
    // Jika terjadi kesalahan, kembalikan respons dengan pesan error
    console.error("Error updating payment status:", error);
    return Response.json({ error: "Failed to update payment status" });
  }
}