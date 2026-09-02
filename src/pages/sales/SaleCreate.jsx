import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { saleService, customerService, productService } from "../../api/services";
import useCurrencySymbol from "../../hooks/useCurrencySymbol";
import { formatCurrency } from "../../utils/currency";

const emptyItem = { product_id: "", quantity: 1, unit_price: 0 };

export default function SaleCreate() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    customer_id: "",
    invoice_no: "",
    sale_date: new Date().toISOString().slice(0, 10),
    status: "completed",
    notes: "",
    items: [{ ...emptyItem }],
  });

  useEffect(() => {
    customerService
      .list({ per_page: 100 })
      .then((res) => setCustomers(res.data.data))
      .catch((err) => console.error(err));
    productService
      .list({ per_page: 100 })
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const productMap = useMemo(() => {
    const map = {};
    products.forEach((p) => (map[p.id] = p));
    return map;
  }, [products]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "product_id") {
      const product = productMap[value];
      if (product) {
        newItems[index].unit_price = product.sale_price;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItemRow = () => {
    setFormData({ ...formData, items: [...formData.items, { ...emptyItem }] });
  };

  const removeItemRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const grandTotal = formData.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
    0
  );

  const currencySymbol = useCurrencySymbol();

  const availableStockFor = (productId) => productMap[productId]?.stock_quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const res = await saleService.create({
        ...formData,
        customer_id: formData.customer_id || null,
      });
      const saleId = res.data.data.id;
      navigate(`/sales/${saleId}`);
    } catch (err) {
      console.error("Error response:", err.response?.data);
      setFormError(
        err.response?.data?.message ||
          "Failed to save the sale invoice. Please check the form and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">New Sale Invoice</h2>

      {formError && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-3 mb-4">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Customer</label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
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
              placeholder="e.g. INV-0001"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Sale Date</label>
            <input
              type="date"
              value={formData.sale_date}
              onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
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
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Completed deducts stock immediately. Pending can be completed later.
            </p>
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
        <h3 className="text-lg font-semibold">Invoice Items</h3>
        {formData.items.map((item, index) => {
          const stock = availableStockFor(item.product_id);
          const lineTotal = Number(item.quantity || 0) * Number(item.unit_price || 0);
          const overStock =
            formData.status === "completed" &&
            item.product_id &&
            stock !== undefined &&
            Number(item.quantity || 0) > stock;

          return (
            <div key={index} className="mb-2">
              <div className="flex gap-2 items-center">
                <select
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                  className="border p-2 rounded flex-1"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock_quantity})
                    </option>
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
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                  className="border p-2 rounded w-28"
                  step="0.01"
                  min="0"
                  required
                />
                <div className="w-28 text-right text-sm font-medium">
                  {formatCurrency(lineTotal, currencySymbol)}
                </div>
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
              {overStock && (
                <p className="text-xs text-red-600 mt-1">
                  Only {stock} in stock — reduce the quantity or this sale will be rejected.
                </p>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={addItemRow}
          className="bg-gray-200 px-3 py-1 rounded text-sm mb-4"
        >
          + Add Item
        </button>

        <div className="border-t pt-4 flex justify-end">
          <div className="text-sm space-y-1 w-full max-w-xs">
            <div className="flex justify-between font-bold text-base border-t pt-1">
              <span>Grand Total</span>
              <span>{formatCurrency(grandTotal, currencySymbol)}</span>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save & Print Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}