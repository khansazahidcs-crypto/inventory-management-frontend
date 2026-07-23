import { useEffect, useRef, useState } from "react";

/**
 * Debounced search box — waits 400ms after typing stops before firing
 * onSearch, so we don't hit the API on every keystroke.
 */
export default function SearchInput({ value, onSearch, placeholder = "Search..." }) {
  const [text, setText] = useState(value || "");
  const timerRef = useRef(null);

  useEffect(() => {
    setText(value || "");
  }, [value]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(newText), 400);
  };

  return (
    <input
      type="text"
      value={text}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
