import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { saleService } from "../../api/services";
import useCurrencySymbol from "../../hooks/useCurrencySymbol";
import { formatCurrency } from "../../utils/currency";

export default function SaleList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setLoading(true);
    saleService
      .list({ search: search || undefined, status: status || undefined })
      .then((res) => {
        setSales(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales:", err);
        setError("Failed to load sales history.");
        setLoading(false);
      });
  }, [reloadToken]);

  const handleSearch = (e) => {
    e.preventDefault();
    setReloadToken((t) => t + 1);
  };

  const handleComplete = async (sale) => {
    if (!window.confirm(`Mark invoice ${sale.invoice_no} as completed? This will deduct stock.`)) {
      return;
    }
    try {
      await saleService.complete(sale.id);
      setReloadToken((t) => t + 1);
    } catch (err) {
      console.error("Error completing sale:", err);
      alert(err.response?.data?.message || "Failed to complete sale.");
    }
  };

  const handleCancel = async (sale) => {
    if (
      !window.confirm(
        `Cancel invoice ${sale.invoice_no}? If it was completed, stock will be restored.`
      )
    ) {
      return;
    }
    try {
      await saleService.cancel(sale.id);
      setReloadToken((t) => t + 1);
    } catch (err) {
      console.error("Error cancelling sale:", err);
      alert(err.response?.data?.message || "Failed to cancel sale.");
    }
  };

  const currencySymbol = useCurrencySymbol();

  const statusBadge = (s) => {
    const styles = {
      completed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[s] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return <div className="p-6 text-center">Loading sales history...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sales History</h2>
        <Link
          to="/sales/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Sale
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by invoice no."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Search
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-3 text-left">Invoice No.</th>
              <th className="border border-gray-200 p-3 text-left">Customer</th>
              <th className="border border-gray-200 p-3 text-left">Date</th>
              <th className="border border-gray-200 p-3 text-right">Total</th>
              <th className="border border-gray-200 p-3 text-left">Status</th>
              <th className="border border-gray-200 p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3">{s.invoice_no}</td>
                  <td className="border border-gray-200 p-3">
                    {s.customer_name || s.customer?.name || "Walk-in Customer"}
                  </td>
                  <td className="border border-gray-200 p-3">{s.sale_date}</td>
                  <td className="border border-gray-200 p-3 text-right">
                    {formatCurrency(s.total_amount, currencySymbol)}
                  </td>
                  <td className="border border-gray-200 p-3 capitalize">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="border border-gray-200 p-3 text-center space-x-2 whitespace-nowrap">
                    <Link
                      to={`/sales/${s.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      View / Print
                    </Link>
                    {s.status === "pending" && (
                      <button
                        onClick={() => handleComplete(s)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Complete
                      </button>
                    )}
                    {s.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(s)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}