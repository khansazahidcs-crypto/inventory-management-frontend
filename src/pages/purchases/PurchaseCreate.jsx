import React, { useState, useEffect } from "react";
import { purchaseService, supplierService, productService } from "../../api/services";
import { useNavigate } from "react-router-dom";

export default function PurchaseCreate() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    supplier_id: "",
    invoice_no: "",
    purchase_date: "",
    status: "received",
    notes: "",
    items: [{ product_id: "", quantity: 1, unit_cost: 0 }],
  });

  useEffect(() => {
    supplierService.list().then((res) => setSuppliers(res.data.data)).catch((err) => console.error(err));
    productService.list().then((res) => setProducts(res.data.data)).catch((err) => console.error(err));
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: "", quantity: 1, unit_cost: 0 }],
    });
  };

  const removeItemRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await purchaseService.create(formData);
      alert("Purchase saved successfully!");
      navigate("/purchases");
    } catch (err) {
      console.error("Error response:", err.response?.data);
      alert("Failed to save purchase. Check console for details.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">New Purchase</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Supplier</label>
            <select
              value={formData.supplier_id}
              onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Invoice No.</label>
            <input
              type="text"
              value={formData.invoice_no}
              onChange={(e) => setFormData({ ...formData, invoice_no: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Purchase Date</label>
            <input
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <hr className="my-4" />
        <h3 className="text-lg font-semibold">Purchase Items</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center mb-2">
            <select
              value={item.product_id}
              onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
              className="border p-2 rounded flex-1"
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              className="border p-2 rounded w-24"
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Unit Cost"
              value={item.unit_cost}
              onChange={(e) => handleItemChange(index, "unit_cost", e.target.value)}
              className="border p-2 rounded w-28"
              step="0.01"
              min="0"
              required
            />
            {formData.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItemRow(index)}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                X
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItemRow}
          className="bg-gray-200 px-3 py-1 rounded text-sm mb-4"
        >
          + Add Item
        </button>

        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Save Purchase
          </button>
        </div>
      </form>
    </div>
  );
}
