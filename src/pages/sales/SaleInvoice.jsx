import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { saleService } from "../../api/services";
import useCurrencySymbol from "../../hooks/useCurrencySymbol";
import { formatCurrency } from "../../utils/currency";

export default function SaleInvoice() {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setLoading(true);
    saleService
      .get(id)
      .then((res) => {
        setSale(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sale:", err);
        setError("Could not load this invoice.");
        setLoading(false);
      });
  }, [id, reloadToken]);

  const handleComplete = async () => {
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

  const handleCancel = async () => {
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
    return <div className="p-6 text-center">Loading invoice...</div>;
  }

  if (error || !sale) {
    return <div className="p-6 text-center text-red-600">{error || "Invoice not found."}</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="no-print flex justify-between items-center mb-4">
        <Link to="/sales" className="text-blue-600 hover:underline text-sm">
          &larr; Back to Sales History
        </Link>
        <div className="space-x-2">
          {sale.status === "pending" && (
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            >
              Mark Completed
            </button>
          )}
          {sale.status !== "cancelled" && (
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
            >
              Cancel Sale
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Print Invoice
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-8 text-gray-900">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Sales Invoice</h1>
            <p className="text-sm text-gray-500">Invoice No: {sale.invoice_no}</p>
          </div>
          <div className="text-right">
            <p className={`inline-block px-3 py-1 rounded text-xs font-semibold uppercase ${statusBadge(sale.status)}`}>
              {sale.status}
            </p>
            <p className="text-sm text-gray-500 mt-2">Date: {sale.sale_date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-1">Billed To</h3>
            <p className="font-medium">{sale.customer_name || sale.customer?.name || "Walk-in Customer"}</p>
            {sale.customer?.phone && <p className="text-sm text-gray-600">{sale.customer.phone}</p>}
            {sale.customer?.email && <p className="text-sm text-gray-600">{sale.customer.email}</p>}
            {sale.customer?.address && <p className="text-sm text-gray-600">{sale.customer.address}</p>}
          </div>
          <div className="text-right">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-1">Served By</h3>
            <p className="text-sm text-gray-600">{sale.user?.name || "-"}</p>
          </div>
        </div>

        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b-2 border-gray-800 text-left text-sm">
              <th className="py-2">Product</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 text-sm">
                <td className="py-2">{item.product_name || item.product?.name}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.unit_price, currencySymbol)}</td>
                <td className="py-2 text-right">{formatCurrency(item.subtotal, currencySymbol)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 text-sm space-y-1">
            <div className="flex justify-between font-bold text-base border-t pt-1">
              <span>Grand Total</span>
              <span>{formatCurrency(sale.total_amount, currencySymbol)}</span>
            </div>
          </div>
        </div>

        {sale.notes && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-1">Notes</h3>
            <p className="text-sm text-gray-600">{sale.notes}</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">Thank you for your business!</p>
      </div>
    </div>
  );
}