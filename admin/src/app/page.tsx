import { ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '₹1,24,500', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  { name: 'Orders Today', value: '24', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  { name: 'Active Users', value: '1,200', icon: Users, color: 'bg-purple-100 text-purple-600' },
  { name: 'Low Stock', value: '5', icon: Package, color: 'bg-orange-100 text-orange-600' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">#ORD-1234</td>
                  <td className="px-4 py-3">Ansarul</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">Paid</span>
                  </td>
                  <td className="px-4 py-3">₹5,499</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">#ORD-1235</td>
                  <td className="px-4 py-3">Rahul</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-600">Pending</span>
                  </td>
                  <td className="px-4 py-3">₹1,299</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">Best Selling Products</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-slate-100" />
              <div className="flex-1">
                <p className="font-medium">Pro-Mixer Master</p>
                <p className="text-xs text-muted-foreground">Appliances • 45 Sales</p>
              </div>
              <p className="font-bold">₹12,999</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-slate-100" />
              <div className="flex-1">
                <p className="font-medium">Steel-Core Cookware</p>
                <p className="text-xs text-muted-foreground">Cookware • 32 Sales</p>
              </div>
              <p className="font-bold">₹5,499</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
