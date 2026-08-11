import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportService } from "../../api/services";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function StockReport() {
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    reportService
      .stock({ low_stock: lowStockOnly ? 1 : undefined })
      .then((res) => {
        setRows(res.data.data);
        setSummary(res.data.summary);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stock report:", err);
        setError("Failed to load the stock report.");
        setLoading(false);
      });
  }, [lowStockOnly]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      await reportService.downloadCsv(
        "stock",
        { low_stock: lowStockOnly ? 1 : undefined },
        "stock-report.csv"
      );
    } catch (err) {
      console.error("Error exporting CSV:", err);
      alert("Failed to export CSV.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="no-print flex justify-between items-center mb-4">
        <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
          &larr; Back to Dashboard
        </Link>
        <div className="space-x-2">
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-1">Stock Report</h1>
        <p className="text-sm text-gray-500 mb-6">Current stock levels and valuation</p>

        <label className="no-print flex items-center gap-2 mb-6 text-sm">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Show low-stock items only
        </label>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {loading ? (
          <p className="text-gray-500">Loading report...</p>
        ) : (
          <>
            {summary && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500">Products</p>
                  <p className="text-xl font-bold">{summary.total_products}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500">Total Stock Value</p>
                  <p className="text-xl font-bold text-blue-700">
                    {formatCurrency(summary.total_stock_value)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500">Low Stock Items</p>
                  <p className="text-xl font-bold text-amber-600">
                    {summary.low_stock_count}
                  </p>
                </div>
              </div>
            )}

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800 text-left text-sm">
                  <th className="py-2">SKU</th>
                  <th className="py-2">Product</th>
                  <th className="py-2">Category</th>
                  <th className="py-2 text-right">Stock Qty</th>
                  <th className="py-2 text-right">Reorder Level</th>
<th className="py-2 text-right pr-6">Stock Value</th>
                  <th className="py-2">Status</th>
                </tr>
          
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((p) => (
                    <tr key={p.id} className="border-b border-gray-200 text-sm">
                      <td className="py-2">{p.sku}</td>
                      <td className="py-2">{p.name}</td>
                      <td className="py-2">{p.category_name || "-"}</td>
                      <td className="py-2 text-right">{p.stock_quantity}</td>
                      <td className="py-2 text-right">{p.reorder_level}</td>
<td className="py-2 text-right pr-6">{formatCurrency(p.stock_value)}</td>                      <td className="py-2">
                        {p.is_low_stock ? (
                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-semibold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
