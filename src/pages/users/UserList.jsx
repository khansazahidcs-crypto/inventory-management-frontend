import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import FormModal from "../../components/common/FormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useResourceList from "../../components/common/useResourceList";
import { userService, roleService } from "../../api/services";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role_name", label: "Role", render: (r) => r.role_name || "— none —" },
  {
    key: "is_active",
    label: "Status",
    render: (r) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          r.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        {r.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export default function UserList() {
  const list = useResourceList(userService);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    roleService
      .list()
      .then((res) => setRoles(res.data.data))
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));

  const isEditing = !!list.editingRow;

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    ...(isEditing
      ? []
      : [
          { name: "password", label: "Password", type: "password", required: true },
          {
            name: "password_confirmation",
            label: "Confirm Password",
            type: "password",
            required: true,
          },
        ]),
    { name: "role_id", label: "Role", type: "select", options: roleOptions },
    { name: "is_active", label: "Active", type: "toggle" },
  ];

  return (
    <>
      <DataTable
        title="Users"
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
        title={isEditing ? "Edit User" : "Add User"}
        fields={fields}
        initialValues={list.editingRow || {}}
        onClose={list.closeForm}
        onSubmit={list.submitForm}
        submitting={list.submitting}
        errors={list.errors}
      />

      <ConfirmDialog
        open={!!list.deleteTarget}
        title="Delete User"
        message={`Delete "${list.deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={list.confirmDelete}
        onCancel={() => list.setDeleteTarget(null)}
        loading={list.deleting}
      />
    </>
  );
}
