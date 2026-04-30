import api from "../../core/api/api";

export const uploadFileAPI = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post<{ url: string }>("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteFileAPI = (fileName: string) => {
  return api.delete(`/files/${fileName}`);
};