import { axiosInstance } from "../utils";

type UploadImageResponse = {
  success: boolean;
  imageUrl: string;
  ipfsHash: string;
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await axiosInstance.post<UploadImageResponse>(
      "/user/upload/image",
      formData,
    );

    if (!data.success || !data.imageUrl) {
      throw new Error("Image upload returned an unexpected response");
    }

    return data.imageUrl;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Image upload failed";
    throw new Error(message);
  }
}
