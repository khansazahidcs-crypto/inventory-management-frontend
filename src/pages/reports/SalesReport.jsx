import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportService } from "../../api/services";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function SalesReport() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    reportService
      .sales({ date_from: dateFrom || undefined, date_to: dateTo || undefined })
      .then((res) => {
        setRows(res.data.data);
        setSummary(res.data.summary);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales report:", err);
        setError("Failed to load the sales report.");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken]);

  const applyFilters = (e) => {
    e.preventDefault();
    setReloadToken((t) => t + 1);
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      await reportService.downloadCsv(
        "sales",
        { date_from: dateFrom || undefined, date_to: dateTo || undefined },
        "sales-report.csv"
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
        <h1 className="text-2xl font-bold mb-1">Sales Report</h1>
        <p className="text-sm text-gray-500 mb-6">
          {dateFrom || dateTo
            ? `${dateFrom || "start"} to ${dateTo || "today"}`
            : "All completed sales"}
        </p>

        <form onSubmit={applyFilters} className="no-print flex flex-wrap gap-3 items-end mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-600">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
          >
            Apply Filter
          </button>
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setReloadToken((t) => t + 1);
              }}
              className="text-sm text-gray-500 hover:underline"
            >
              Clear
            </button>
          )}
        </form>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {loading ? (
          <p className="text-gray-500">Loading report...</p>
        ) : (
          <>
            {summary && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500">Invoices</p>
                  <p className="text-xl font-bold">{summary.count}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(summary.total_revenue)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500">Average Order Value</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(summary.average_order_value)}
                  </p>
                </div>
              </div>
            )}

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800 text-left text-sm">
                  <th className="py-2">Invoice No.</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Date</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-200 text-sm">
                      <td className="py-2">{sale.invoice_no}</td>
                      <td className="py-2">
                        {sale.customer_name || sale.customer?.name || "Walk-in Customer"}
                      </td>
                      <td className="py-2">{sale.sale_date}</td>
                      <td className="py-2 text-right">{formatCurrency(sale.total_amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No completed sales in this range.
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
