import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";

/**
 * Generic Add/Edit modal. Renders inputs from a `fields` config array so
 * every module (Category, Brand, Supplier, Customer, Product) can reuse
 * this same component instead of writing a separate modal each time.
 *
 * fields example:
 * [
 *   { name: "name", label: "Name", type: "text", required: true },
 *   { name: "status", label: "Active", type: "toggle" },
 *   { name: "category_id", label: "Category", type: "select", options: [...] },
 *   { name: "image", label: "Product Image", type: "image" },
 * ]
 */
export default function FormModal({
  open,
  title,
  fields,
  initialValues = {},
  onClose,
  onSubmit,
  submitting = false,
  errors = {},
}) {
  const [values, setValues] = useState({});

  useEffect(() => {
    if (open) {
      const defaults = {};
      fields.forEach((f) => {
        if (f.type === "toggle") {
          defaults[f.name] = initialValues[f.name] ?? true;
        } else {
          defaults[f.name] = initialValues[f.name] ?? "";
        }
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(defaults);
    }
  }, [open, initialValues, fields]);

  if (!open) return null;

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isWide = fields.length > 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className={`bg-white rounded-xl shadow-xl w-full ${isWide ? "max-w-2xl" : "max-w-md"} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`grid ${isWide ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
            {fields.map((field) => (
              <div
                key={field.name}
                className={
                  field.type === "textarea" || field.type === "image" || field.fullWidth
                    ? "col-span-full"
                    : ""
                }
              >
                {field.type !== "toggle" && field.type !== "image" && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                )}

                {field.type === "text" || field.type === "email" || field.type === "number" || field.type === "password" ? (
                  <input
                    type={field.type}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    step={field.type === "number" ? field.step || "0.01" : undefined}
                    autoComplete={field.type === "password" ? "new-password" : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "toggle" ? (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!values[field.name]}
                      onChange={(e) => setField(field.name, e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">{field.label}</span>
                  </label>
                ) : field.type === "image" ? (
                  <ImageUpload
                    label={field.label}
                    previewUrl={initialValues[field.previewField] || null}
                    onChange={(file) => setField(field.name, file)}
                  />
                ) : null}

                {errors[field.name] && (
                  <p className="text-xs text-red-500 mt-1">{errors[field.name][0]}</p>
                )}
              </div>
            ))}
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
