import DataTable from "../../components/common/DataTable";
import FormModal from "../../components/common/FormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useResourceList from "../../components/common/useResourceList";
import { supplierService } from "../../api/services";

const fields = [
  { name: "name", label: "Contact Name", type: "text", required: true },
  { name: "company_name", label: "Company Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "city", label: "City", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "address", label: "Address", type: "textarea", fullWidth: true },
  { name: "status", label: "Active", type: "toggle" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "company_name", label: "Company", render: (r) => r.company_name || "—" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email", render: (r) => r.email || "—" },
  { key: "city", label: "City", render: (r) => r.city || "—" },
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

export default function SupplierList() {
  const list = useResourceList(supplierService);

  return (
    <>
      <DataTable
        title="Suppliers"
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
        title={list.editingRow ? "Edit Supplier" : "Add Supplier"}
        fields={fields}
        initialValues={list.editingRow || {}}
        onClose={list.closeForm}
        onSubmit={list.submitForm}
        submitting={list.submitting}
        errors={list.errors}
      />

      <ConfirmDialog
        open={!!list.deleteTarget}
        title="Delete Supplier"
        message={`Delete "${list.deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={list.confirmDelete}
        onCancel={() => list.setDeleteTarget(null)}
        loading={list.deleting}
      />
    </>
  );
}
