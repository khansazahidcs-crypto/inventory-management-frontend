import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FormModal from "../../components/common/FormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useResourceList from "../../components/common/useResourceList";
import { productService, categoryService, brandService } from "../../api/services";
import useCurrencySymbol from "../../hooks/useCurrencySymbol";
import { formatCurrency } from "../../utils/currency";

export default function ProductList() {
  const list = useResourceList(productService);
  const currencySymbol = useCurrencySymbol();

  // Category & Brand dropdown options — fetched once for the Add/Edit form
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);

  useEffect(() => {
    categoryService.list({ per_page: 100 }).then(({ data }) => {
      setCategoryOptions(data.data.map((c) => ({ value: c.id, label: c.name })));
    });
    brandService.list({ per_page: 100 }).then(({ data }) => {
      setBrandOptions(data.data.map((b) => ({ value: b.id, label: b.name })));
    });
  }, []);

  const fields = [
    { name: "name", label: "Product Name", type: "text", required: true },
    { name: "sku", label: "SKU", type: "text", required: true },
    { name: "category_id", label: "Category", type: "select", required: true, options: categoryOptions },
    { name: "brand_id", label: "Brand", type: "select", options: brandOptions },
    { name: "unit", label: "Unit (pcs, kg, box...)", type: "text", required: true },
    { name: "purchase_price", label: "Purchase Price", type: "number", required: true },
    { name: "sale_price", label: "Sale Price", type: "number", required: true },
    { name: "reorder_level", label: "Reorder Level", type: "number" },
    { name: "stock_quantity", label: "Stock Quantity", type: "number", required: true }, // Added stock quantity field
    { name: "image", label: "Product Image", type: "image", previewField: "image_url" },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
    { name: "status", label: "Active", type: "toggle" },
  ];

  const columns = [
    {
      key: "image_url",
      label: "Image",
      render: (r) =>
        r.image_url ? (
          <img src={r.image_url} alt={r.name} className="w-10 h-10 rounded object-cover" />
        ) : (
          <div className="w-10 h-10 rounded bg-gray-100" />
        ),
    },
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "category_name", label: "Category", render: (r) => r.category_name || "—" },
    { key: "sale_price", label: "Price", render: (r) => formatCurrency(r.sale_price, currencySymbol) },
    {
      key: "stock_quantity",
      label: "Stock",
      render: (r) => (
        <span className={r.stock_quantity <= r.reorder_level ? "text-red-600 font-medium" : ""}>
          {r.stock_quantity}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span className={`px-2 py-1 rounded-full text-xs ${r.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {r.status ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Products"
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        search={list.search}
        onSearch={list.handleSearch}
        meta={list.meta}
        onPageChange={list.setPage}
        onAdd={list.openAdd}
        onEdit={list.openEdit}
        onDelete={list.setDeleteTarget}
      />

      <FormModal
        open={list.formOpen}
        title={list.editingRow ? "Edit Product" : "Add Product"}
        fields={fields}
        initialValues={list.editingRow || {}}
        onClose={list.closeForm}
        onSubmit={list.submitForm}
        submitting={list.submitting}
        errors={list.errors}
      />

      <ConfirmDialog
        open={!!list.deleteTarget}
        title="Delete Product"
        message={`Delete "${list.deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={list.confirmDelete}
        onCancel={() => list.setDeleteTarget(null)}
        loading={list.deleting}
      />
    </>
  );
}