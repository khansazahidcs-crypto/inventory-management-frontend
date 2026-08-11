import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { inventoryService } from "../../api/services";

export default function InventoryList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await inventoryService.list({
        search,
        low_stock: lowStockOnly ? 1 : undefined,
      });
      setRows(data.data);
    } finally {
      setLoading(false);
    }
  }, [search, lowStockOnly]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Inventory Levels</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
            />
            Low stock only
          </label>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="py-2 pr-4 font-medium">Product</th>
            <th className="py-2 pr-4 font-medium">Stock</th>
            <th className="py-2 pr-4 font-medium">Reorder Level</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="py-6 text-center text-gray-400">Loading...</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={5} className="py-6 text-center text-gray-400">No products found.</td></tr>
          ) : (
            rows.map((product) => {
              const isLow = product.stock_quantity <= product.reorder_level;
              return (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4">{product.name}</td>
                  <td className={`py-3 pr-4 font-medium ${isLow ? "text-red-600" : ""}`}>
                    {product.stock_quantity}
                  </td>
                  <td className="py-3 pr-4">{product.reorder_level}</td>
                  <td className="py-3 pr-4">
                    {isLow ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Low Stock</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">OK</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <Link to={`/inventory/${product.id}/history`} className="text-blue-600 hover:underline text-sm">
                      View History
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
