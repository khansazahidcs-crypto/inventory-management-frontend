import { useEffect, useState } from "react";
import { roleService } from "../../api/services";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import RoleFormModal from "./RoleFormModal";

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([roleService.list(), roleService.permissions()])
      .then(([rolesRes, permissionsRes]) => {
        setRoles(rolesRes.data.data);
        setPermissionGroups(permissionsRes.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        setError(
          err.response?.status === 403
            ? "You don't have permission to manage roles."
            : "Failed to load roles."
        );
        setLoading(false);
      });
  }, [reloadToken]);

  const openAdd = () => {
    setEditingRole(null);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setFormErrors({});
    try {
      if (editingRole) {
        await roleService.update(editingRole.id, values);
      } else {
        await roleService.create(values);
      }
      setFormOpen(false);
      setReloadToken((t) => t + 1);
    } catch (err) {
      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors || {});
      } else {
        alert(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await roleService.remove(deleteTarget.id);
      setDeleteTarget(null);
      setReloadToken((t) => t + 1);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete this role.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading roles...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Roles</h2>
        <button
          onClick={openAdd}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          + Add Role
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Description</th>
              <th className="py-2 pr-4 font-medium">Permissions</th>
              <th className="py-2 pr-4 font-medium">Users</th>
              <th className="py-2 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-800">{role.name}</td>
                <td className="py-3 pr-4 text-gray-600">{role.description || "—"}</td>
                <td className="py-3 pr-4 text-gray-600">{role.permissions.length}</td>
                <td className="py-3 pr-4 text-gray-600">{role.users_count}</td>
                <td className="py-3 pr-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => openEdit(role)}
                    className="text-blue-600 hover:underline text-sm mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteError("");
                      setDeleteTarget(role);
                    }}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RoleFormModal
        open={formOpen}
        title={editingRole ? "Edit Role" : "Add Role"}
        initialValues={editingRole || {}}
        permissionGroups={permissionGroups}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        errors={formErrors}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Role"
        message={
          deleteError ||
          `Delete "${deleteTarget?.name}"? This cannot be undone.`
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
