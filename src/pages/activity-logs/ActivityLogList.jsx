import { useEffect, useState } from "react";
import { activityLogService } from "../../api/services";

const ACTION_STYLES = {
  created: "bg-green-100 text-green-700",
  updated: "bg-blue-100 text-blue-700",
  deleted: "bg-red-100 text-red-700",
  login: "bg-slate-100 text-slate-700",
  logout: "bg-slate-100 text-slate-700",
};

export default function ActivityLogList() {
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    activityLogService
      .list({
        action: action || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      })
      .then((res) => {
        setLogs(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activity logs:", err);
        setError(
          err.response?.status === 403
            ? "You don't have permission to view activity logs."
            : "Failed to load activity logs."
        );
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken]);

  const applyFilters = (e) => {
    e.preventDefault();
    setReloadToken((t) => t + 1);
  };

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Logs</h2>

      <form onSubmit={applyFilters} className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-gray-700 text-white hover:bg-gray-800"
        >
          Apply Filter
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-4 font-medium">When</th>
              <th className="py-2 pr-4 font-medium">User</th>
              <th className="py-2 pr-4 font-medium">Action</th>
              <th className="py-2 pr-4 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  No activity found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-gray-700">{log.user_name}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ACTION_STYLES[log.action] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-700">{log.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
