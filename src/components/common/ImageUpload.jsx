import { useRef, useState } from "react";

/**
 * Click-to-upload image field with live preview.
 * previewUrl = existing image URL (edit mode), file = newly selected File.
 */
export default function ImageUpload({ label = "Image", previewUrl, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(previewUrl || null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg
                   flex items-center justify-center cursor-pointer overflow-hidden
                   hover:border-blue-400 bg-gray-50"
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400 text-center px-2">Click to upload</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
