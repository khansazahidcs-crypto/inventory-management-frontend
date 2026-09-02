import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { dashboardService } from "../api/services";
import useCurrencySymbol from "../hooks/useCurrencySymbol";
import { formatCurrency } from "../utils/currency";

function StatCard({ label, value, sub, accent = "text-white" }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function SalesTrendChart({ trend, currencySymbol }) {
  const max = Math.max(1, ...trend.map((d) => d.total));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      <h2 className="text-lg font-semibold mb-4">Sales — Last 7 Days</h2>
      <div className="flex items-end gap-3 h-40">
        {trend.map((day) => {
          const heightPct = Math.max(4, Math.round((day.total / max) * 100));
          const label = new Date(day.date).toLocaleDateString(undefined, {
            weekday: "short",
          });
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end h-32">
                <div
                  className="w-full bg-blue-600 rounded-t-md transition-all"
                  style={{ height: `${heightPct}%` }}
                  title={`${day.date}: ${formatCurrency(day.total, currencySymbol)}`}
                />
              </div>
              <span className="text-slate-500 text-xs">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const currencySymbol = useCurrencySymbol();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardService
      .summary()
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard summary:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-6">Welcome to your dashboard</p>

      {loading && <p className="text-slate-400">Loading dashboard...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {data && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Products" value={data.total_products} />
            <StatCard label="Total Customers" value={data.total_customers} />
            <StatCard label="Total Suppliers" value={data.total_suppliers} />
            <StatCard
              label="Low Stock Items"
              value={data.low_stock_count}
              accent={data.low_stock_count > 0 ? "text-amber-400" : "text-white"}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Sales Revenue (All Time)"
              value={formatCurrency(data.sales_revenue_total, currencySymbol)}
              accent="text-green-400"
            />
            <StatCard
              label="Purchases Cost (All Time)"
              value={formatCurrency(data.purchases_cost_total, currencySymbol)}
              accent="text-blue-400"
            />
            <StatCard
              label="Pending Sales"
              value={data.pending_sales_count}
              sub="awaiting completion"
            />
            <StatCard
              label="Pending Purchases"
              value={data.pending_purchases_count}
              sub="awaiting receipt"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-5">
              <p className="text-slate-400 text-sm mb-1">Sales This Month</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(data.sales_this_month, currencySymbol)}
              </p>
              {data.sales_month_over_month_change !== null && (
                <p
                  className={`text-xs mt-1 ${
                    data.sales_month_over_month_change >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {data.sales_month_over_month_change >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(data.sales_month_over_month_change)}% vs last month (
                  {formatCurrency(data.sales_last_month, currencySymbol)})
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <SalesTrendChart trend={data.sales_trend_last_7_days} currencySymbol={currencySymbol} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Recent Sales</h2>
                <Link to="/reports/sales" className="text-blue-400 text-sm hover:underline">
                  View report →
                </Link>
              </div>
              {data.recent_sales.length === 0 ? (
                <p className="text-slate-500 text-sm">No sales yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {data.recent_sales.map((sale) => (
                      <tr key={sale.id} className="border-t border-slate-800">
                        <td className="py-2 text-slate-300">{sale.invoice_no}</td>
                        <td className="py-2 text-slate-400">
                          {sale.customer_name || sale.customer?.name || "Walk-in"}
                        </td>
                        <td className="py-2 text-slate-500">{sale.sale_date}</td>
                        <td className="py-2 text-right text-white">
                          {formatCurrency(sale.total_amount, currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Recent Purchases</h2>
                <Link to="/reports/purchases" className="text-blue-400 text-sm hover:underline">
                  View report →
                </Link>
              </div>
              {data.recent_purchases.length === 0 ? (
                <p className="text-slate-500 text-sm">No purchases yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {data.recent_purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-t border-slate-800">
                        <td className="py-2 text-slate-300">{purchase.invoice_no}</td>
                        <td className="py-2 text-slate-400">
                          {purchase.supplier_name || purchase.supplier?.name || "-"}
                        </td>
                        <td className="py-2 text-slate-500">{purchase.purchase_date}</td>
                        <td className="py-2 text-right text-white">
                          {formatCurrency(purchase.total_amount, currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-3">Top Selling Products</h2>
            {data.top_selling_products.length === 0 ? (
              <p className="text-slate-500 text-sm">No completed sales yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-left">
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium text-right">Qty Sold</th>
                    <th className="pb-2 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_selling_products.map((p) => (
                    <tr key={p.product_id} className="border-t border-slate-800">
                      <td className="py-2 text-slate-200">{p.product_name}</td>
                      <td className="py-2 text-right text-slate-300">{p.quantity_sold}</td>
                      <td className="py-2 text-right text-white">
                        {formatCurrency(p.revenue, currencySymbol)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
