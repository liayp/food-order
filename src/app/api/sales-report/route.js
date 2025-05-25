import mongoose from 'mongoose';
import { Order } from '@/models/Order';
import { isAdmin } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);
  if (!(await isAdmin())) return Response.json({});

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) return Response.json({ error: 'Missing date' });

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  const orders = await Order.find({
    paid: true,
    createdAt: { $gte: start, $lt: end },
  });

  let totalSales = 0;
  const productCount = {};

  orders.forEach(order => {
    Object.values(order.cartProducts).forEach(prod => {
      const qty = prod.qty || 1;
      const name = prod.name;
      totalSales += prod.price * qty;
      productCount[name] = (productCount[name] || 0) + qty;
    });
  });

  const pieData = {
    labels: Object.keys(productCount),
    datasets: [
      {
        data: Object.values(productCount),
        backgroundColor: [
          '#facc15', '#60a5fa', '#f87171', '#34d399', '#a78bfa', '#f472b6'
        ],
      },
    ],
  };

  const barData = {
    labels: Object.keys(productCount),
    datasets: [
      {
        label: 'Jumlah Terjual',
        data: Object.values(productCount),
        backgroundColor: '#facc15',
      },
    ],
  };

  return Response.json({
    totalRevenue: totalSales,
    totalSold: Object.values(productCount).reduce((a, b) => a + b, 0),
    productStats: Object.entries(productCount).map(([name, quantity]) => {
      const revenue = orders.reduce((sum, order) => {
        const prod = Object.values(order.cartProducts).find(p => p.name === name);
        return sum + (prod?.price || 0) * (prod?.qty || 1);
      }, 0);
      return { name, quantity, revenue };
    }),
  });

}
