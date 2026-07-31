import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { inventoryService } from "../../api/services";

export default function StockHistory() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await inventoryService.history(id);
      setProduct(data.product);
      setHistory(data.history.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Stock History {product ? `— ${product.name}` : ""}
      </h2>
      {product && (
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Current stock: <span className="font-medium text-gray-900">{product.stock_quantity}</span>
        </p>
      )}

      <table className="w-full text-sm mt-4">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Change</th>
            <th className="py-2 pr-4 font-medium">Before</th>
            <th className="py-2 pr-4 font-medium">After</th>
            <th className="py-2 pr-4 font-medium">Note</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="py-6 text-center text-gray-400">Loading...</td></tr>
          ) : history.length === 0 ? (
            <tr><td colSpan={6} className="py-6 text-center text-gray-400">No stock movements recorded yet.</td></tr>
          ) : (
            history.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">{new Date(entry.created_at).toLocaleString()}</td>
                <td className="py-3 pr-4">{entry.type}</td>
                <td className={`py-3 pr-4 font-medium ${entry.quantity_change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {entry.quantity_change >= 0 ? "+" : ""}{entry.quantity_change}
                </td>
                <td className="py-3 pr-4">{entry.previous_stock}</td>
                <td className="py-3 pr-4">{entry.new_stock}</td>
                <td className="py-3 pr-4">{entry.note || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Link to="/inventory" className="inline-block mt-4 text-blue-600 hover:underline text-sm">
        &larr; Back to inventory
      </Link>
    </div>
  );
}
