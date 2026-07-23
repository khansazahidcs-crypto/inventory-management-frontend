export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page, from, to, total } = meta;

  const pages = [];
  const start = Math.max(1, current_page - 2);
  const end = Math.min(last_page, current_page + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <span>
        Showing {from}-{to} of {total}
      </span>
      <div className="flex gap-1">
        <button
          disabled={current_page === 1}
          onClick={() => onPageChange(current_page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 border rounded ${
              p === current_page ? "bg-blue-600 text-white border-blue-600" : ""
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={current_page === last_page}
          onClick={() => onPageChange(current_page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
