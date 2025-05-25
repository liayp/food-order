'use client';

import { useEffect, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import { format } from 'date-fns';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function SalesReportPage() {
  const { loading, data } = useProfile();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    fetch(`/api/sales-report?date=${selectedDate}`)
      .then(res => res.json())
      .then(setReportData);
  }, [selectedDate]);

  if (loading) return 'Loading user info...';
  if (!data?.admin) return 'Not an admin.';

  const totalSold = reportData.totalSold || 0;
  const totalRevenue = reportData.totalRevenue || 0;
  const productStats = reportData.productStats || [];

  const barData = {
    labels: productStats.map(p => p.name),
    datasets: [
      {
        label: 'Jumlah Terjual',
        data: productStats.map(p => p.quantity),
        backgroundColor: '#facc15',
      }
    ]
  };

  const pieData = {
    labels: productStats.map(p => p.name),
    datasets: [
      {
        data: productStats.map(p => p.quantity),
        backgroundColor: ['#facc15', '#fde68a', '#fef3c7'],
      }
    ]
  };

  return (
    <section className="mt-8 max-w-4xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="flex justify-between items-center mt-8">
        <h1 className="text-2xl font-bold">Laporan Harian</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 my-6">
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-600">Total Produk Terjual:</p>
          <p className="text-xl font-bold">{totalSold} item</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-600">Total Pendapatan:</p>
          <p className="text-xl font-bold">Rp {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Jumlah Produk Terjual</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Persentase Produk Terlaris</h2>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded mt-8">
        <h2 className="text-lg font-semibold mb-4">Tabel Penjualan Produk</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Produk</th>
              <th className="p-2">Jumlah Terjual</th>
              <th className="p-2">Pendapatan (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {productStats.map(p => (
              <tr key={p._id}>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.quantity}</td>
                <td className="p-2">Rp {p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
