import { useState } from "react";
import { uploadImageAPI } from "../../features/post/api";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    // Validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return null;
    }

    setError(null);
    setUploading(true);

    try {
      const res = await uploadImageAPI(file);
      return res.data.url;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to upload image";
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    uploading,
    error,
    uploadImage,
    clearError,
  };
};
