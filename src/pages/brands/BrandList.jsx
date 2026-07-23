import DataTable from "../../components/common/DataTable";
import FormModal from "../../components/common/FormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useResourceList from "../../components/common/useResourceList";
import { brandService } from "../../api/services";

const fields = [
  { name: "name", label: "Brand Name", type: "text", required: true },
  { name: "logo", label: "Logo", type: "image", previewField: "logo_url" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "status", label: "Active", type: "toggle" },
];

const columns = [
  {
    key: "logo_url",
    label: "Logo",
    render: (r) =>
      r.logo_url ? (
<img src={r.logo_url} alt={r.name} className="w-12 h-12 rounded object-contain bg-white border border-gray-200 p-1" />      ) : (
        <div className="w-10 h-10 rounded bg-gray-100" />
      ),
  },
  { key: "name", label: "Name" },
  { key: "description", label: "Description", render: (r) => r.description || "—" },
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

export default function BrandList() {
  const list = useResourceList(brandService);

  return (
    <>
      <DataTable
        title="Brands"
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
        title={list.editingRow ? "Edit Brand" : "Add Brand"}
        fields={fields}
        initialValues={list.editingRow || {}}
        onClose={list.closeForm}
        onSubmit={list.submitForm}
        submitting={list.submitting}
        errors={list.errors}
      />

      <ConfirmDialog
        open={!!list.deleteTarget}
        title="Delete Brand"
        message={`Delete "${list.deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={list.confirmDelete}
        onCancel={() => list.setDeleteTarget(null)}
        loading={list.deleting}
      />
    </>
  );
}
