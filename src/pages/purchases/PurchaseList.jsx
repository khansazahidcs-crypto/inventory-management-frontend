import React, { useEffect, useState } from "react";
import { purchaseService } from "../../api/services";
import { Link } from "react-router-dom";

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseService
      .list()
      .then((res) => {
        setPurchases(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching purchases:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      try {
        await purchaseService.remove(id);
        setPurchases(purchases.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting purchase:", err);
        alert("Failed to delete purchase.");
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading purchases...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Purchases</h2>
        <Link
          to="/purchases/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Purchase
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-3 text-left">Invoice No.</th>
              <th className="border border-gray-200 p-3 text-left">Supplier</th>
              <th className="border border-gray-200 p-3 text-left">Date</th>
              <th className="border border-gray-200 p-3 text-left">Status</th>
              <th className="border border-gray-200 p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3">{p.invoice_no}</td>
                  <td className="border border-gray-200 p-3">
                    {p.supplier?.name || "N/A"}
                  </td>
                  <td className="border border-gray-200 p-3">{p.purchase_date}</td>
                  <td className="border border-gray-200 p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === "received"
                          ? "bg-green-100 text-green-700"
                          : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="border border-gray-200 p-3 text-center space-x-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No purchases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
