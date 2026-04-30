import { useState, useRef, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { uploadImageAPI } from "../../features/post/api";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  className = "",
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await uploadImageAPI(file);
      onChange(res.data.url);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    onRemove?.();
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="max-w-xs h-auto rounded-lg"
          />
          <div className="absolute inset-0 rounded-lg bg-black/0 hover:bg-black/40 transition flex items-center justify-center gap-2">
            <button
              onClick={handleClick}
              disabled={loading}
              className="bg-white/80 hover:bg-white text-black p-2 rounded-full transition disabled:opacity-50"
              title="Replace image"
            >
              <Upload size={18} />
            </button>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition disabled:opacity-50"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="w-full border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-white transition cursor-pointer text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
          />

          <Upload size={32} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-gray-500 text-xs">PNG, JPG, GIF up to 5MB</p>
          {loading && <p className="text-blue-400 text-xs mt-2">Uploading...</p>}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
