import DataTable from "../../components/common/DataTable";
import FormModal from "../../components/common/FormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useResourceList from "../../components/common/useResourceList";
import { categoryService } from "../../api/services";

const fields = [
  { name: "name", label: "Category Name", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "status", label: "Active", type: "toggle" },
];

const columns = [
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

export default function CategoryList() {
  const list = useResourceList(categoryService);

  return (
    <>
      <DataTable
        title="Categories"
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
        title={list.editingRow ? "Edit Category" : "Add Category"}
        fields={fields}
        initialValues={list.editingRow || {}}
        onClose={list.closeForm}
        onSubmit={list.submitForm}
        submitting={list.submitting}
        errors={list.errors}
      />

      <ConfirmDialog
        open={!!list.deleteTarget}
        title="Delete Category"
        message={`Delete "${list.deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={list.confirmDelete}
        onCancel={() => list.setDeleteTarget(null)}
        loading={list.deleting}
      />
    </>
  );
}
