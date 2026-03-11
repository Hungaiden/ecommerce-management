import http from "../http";

// Upload 1 ảnh, trả về URL
export const uploadSingleImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await http.post("/upload/single", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data.url as string;
};

// Upload nhiều ảnh cùng lúc (tối đa 5), trả về mảng URL
export const uploadMultipleImages = async (
  files: File[],
): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const response = await http.post("/upload/multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data.urls as string[];
};
