import { useEffect, useState } from "react";
import { settingService } from "../../api/services";

const GROUP_LABELS = {
  general: "General",
  inventory: "Inventory",
};

export default function SettingsPage() {
  const [groups, setGroups] = useState({});
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    settingService
      .list()
      .then((res) => {
        setGroups(res.data.data);
        const initialValues = {};
        Object.values(res.data.data)
          .flat()
          .forEach((setting) => {
            initialValues[setting.key] = setting.value;
          });
        setValues(initialValues);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching settings:", err);
        setError(
          err.response?.status === 403
            ? "You don't have permission to view settings."
            : "Failed to load settings."
        );
        setLoading(false);
      });
  }, []);

  const setField = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaveMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage("");
    try {
      await settingService.update(values);
      setSaveMessage("Settings saved successfully.");
    } catch (err) {
      alert(
        err.response?.status === 403
          ? "You don't have permission to update settings."
          : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading settings...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Application Settings</h2>
      <p className="text-sm text-gray-500 mb-6">
        These values are used across the app (e.g. on printed invoices).
      </p>

      {saveMessage && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {saveMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {Object.entries(groups).map(([group, settings]) => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              {GROUP_LABELS[group] || group}
            </h3>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.key}>
                  {setting.type === "boolean" ? (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!values[setting.key]}
                        onChange={(e) => setField(setting.key, e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">{setting.label}</span>
                    </label>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting.label}
                      </label>
                      <input
                        type={setting.type === "integer" ? "number" : "text"}
                        value={values[setting.key] ?? ""}
                        onChange={(e) => setField(setting.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
