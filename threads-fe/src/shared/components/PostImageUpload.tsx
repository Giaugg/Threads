import { useState, useRef, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { uploadImageAPI } from "../../features/post/api";

interface PostImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  onRemove: () => void;
  previewUrl?: string;
  isLoading?: boolean;
}

export default function PostImageUpload({
  onImageSelect,
  onRemove,
  previewUrl,
  isLoading = false,
}: PostImageUploadProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
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
    const url = URL.createObjectURL(file);
    onImageSelect(file, url);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {!previewUrl ? (
        <label className="group flex w-fit cursor-pointer items-center gap-2 text-[#666] transition-colors hover:text-white disabled:opacity-50">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isLoading || uploadingImage}
          />
          <div className="flex items-center gap-2 rounded-full px-1 py-1 transition-all group-hover:bg-[#1A1A1A]">
            <Upload size={20} strokeWidth={2} />
            <span className="text-[15px] font-medium">Add image</span>
          </div>
        </label>
      ) : (
        <div className="relative max-w-xs">
          <img
            src={previewUrl}
            alt="preview"
            className="max-h-40 w-full rounded-2xl object-cover"
          />
          <div className="absolute inset-0 rounded-2xl bg-black/0 hover:bg-black/40 transition flex items-center justify-center gap-2">
            <button
              onClick={handleClick}
              disabled={isLoading || uploadingImage}
              className="bg-white/80 hover:bg-white text-black p-2 rounded-full transition disabled:opacity-50"
              title="Replace image"
            >
              <Upload size={18} />
            </button>
            <button
              onClick={onRemove}
              disabled={isLoading || uploadingImage}
              className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition disabled:opacity-50"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isLoading || uploadingImage}
          />
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
