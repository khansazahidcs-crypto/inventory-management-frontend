import { useEffect, useState } from "react";

const GROUP_LABELS = {
  general: "General",
  master_data: "Master Data",
  purchases: "Purchases",
  sales: "Sales",
  inventory: "Inventory",
  reports: "Reports",
  administration: "Administration",
};

export default function RoleFormModal({
  open,
  title,
  initialValues = {},
  permissionGroups = {},
  onClose,
  onSubmit,
  submitting = false,
  errors = {},
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissionIds, setPermissionIds] = useState([]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setPermissionIds((initialValues.permissions || []).map((p) => p.id));
    }
  }, [open, initialValues]);

  if (!open) return null;

  const togglePermission = (id) => {
    setPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleGroup = (groupPermissions, allChecked) => {
    const ids = groupPermissions.map((p) => p.id);
    setPermissionIds((prev) =>
      allChecked ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, permission_ids: permissionIds });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
          <div className="border border-gray-200 rounded-lg p-4 max-h-72 overflow-y-auto space-y-4">
            {Object.entries(permissionGroups).map(([group, permissions]) => {
              const allChecked = permissions.every((p) => permissionIds.includes(p.id));
              return (
                <div key={group}>
                  <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={() => toggleGroup(permissions, allChecked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-800">
                      {GROUP_LABELS[group] || group}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 pl-6">
                    {permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600"
                      >
                        <input
                          type="checkbox"
                          checked={permissionIds.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="w-4 h-4"
                        />
                        {permission.name}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
