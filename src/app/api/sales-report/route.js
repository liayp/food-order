import mongoose from 'mongoose';
import { Order } from '@/models/Order';
import { isAdmin } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  await mongoose.connect(process.env.MONGO_URL);
  if (!(await isAdmin())) return Response.json({});

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) return Response.json({ error: 'Missing date' });

  // Buat range waktu dari jam 00:00:00 sampai 23:59:59 
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  
  const orders = await Order.find({
    paid: true,
    createdAt: { $gte: start, $lte: end },
  });

  let totalSales = 0;
  const productCount = {};

  orders.forEach(order => {
    (order.cartProducts || []).forEach(prod => {
      const qty = prod.qty || 1;
      const name = prod.name;
      const price = prod.price || prod.basePrice || 0;

      totalSales += price * qty;
      productCount[name] = (productCount[name] || 0) + qty;
    });
  });

  
  const productStats = Object.entries(productCount).map(([name, quantity]) => {
    const revenue = orders.reduce((sum, order) => {
      const prod = (order.cartProducts || []).find(p => p.name === name);
      const qty = prod?.qty || 1;
      const price = prod?.price || prod?.basePrice || 0;
      return sum + price * qty;
    }, 0);
    return { name, quantity, revenue };
  });

  return Response.json({
    totalRevenue: totalSales,
    totalSold: Object.values(productCount).reduce((a, b) => a + b, 0),
    productStats,
  });
}
