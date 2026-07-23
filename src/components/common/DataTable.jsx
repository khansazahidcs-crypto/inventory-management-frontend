import SearchInput from "./SearchInput";
import Pagination from "./Pagination";

/**
 * Generic list table shared by all 5 modules.
 *
 * columns example:
 * [
 *   { key: "name", label: "Name" },
 *   { key: "status", label: "Status", render: (row) => row.status ? "Active" : "Inactive" },
 * ]
 */
export default function DataTable({
  title,
  columns,
  rows,
  loading,
  search,
  onSearch,
  meta,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-3">
          <SearchInput value={search} onSearch={onSearch} placeholder={`Search ${title.toLowerCase()}...`} />
          <button
            onClick={onAdd}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
          >
            + Add New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="py-2 pr-4 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="py-2 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-6 text-center text-gray-400">
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 pr-4 text-gray-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="py-3 pr-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEdit(row)}
                      className="text-blue-600 hover:underline text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
