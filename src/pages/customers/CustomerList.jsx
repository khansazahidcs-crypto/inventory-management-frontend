import DataTable from "../../components/common/DataTable";
import FormModal from "../../components/common/FormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useResourceList from "../../components/common/useResourceList";
import { customerService } from "../../api/services";

const fields = [
  { name: "name", label: "Customer Name", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "email", label: "Email", type: "email" },
  {
    name: "customer_type",
    label: "Customer Type",
    type: "select",
    required: true,
    options: [
      { value: "retail", label: "Retail" },
      { value: "wholesale", label: "Wholesale" },
    ],
  },
  { name: "address", label: "Address", type: "textarea", fullWidth: true },
  { name: "status", label: "Active", type: "toggle" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email", render: (r) => r.email || "—" },
  {
    key: "customer_type",
    label: "Type",
    render: (r) => (r.customer_type === "wholesale" ? "Wholesale" : "Retail"),
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

export default function CustomerList() {
  const list = useResourceList(customerService);

  return (
    <>
      <DataTable
        title="Customers"
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
        title={list.editingRow ? "Edit Customer" : "Add Customer"}
        fields={fields}
        initialValues={list.editingRow || {}}
        onClose={list.closeForm}
        onSubmit={list.submitForm}
        submitting={list.submitting}
        errors={list.errors}
      />

      <ConfirmDialog
        open={!!list.deleteTarget}
        title="Delete Customer"
        message={`Delete "${list.deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={list.confirmDelete}
        onCancel={() => list.setDeleteTarget(null)}
        loading={list.deleting}
      />
    </>
  );
}
