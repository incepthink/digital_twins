const UPLOAD_BASE = "https://admin.hashcase.co";

type UploadImageResponse = {
  success: boolean;
  imageUrl: string;
  ipfsHash: string;
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${UPLOAD_BASE}/api/upload-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message || `Image upload failed (${response.status})`);
  }

  const data: UploadImageResponse = await response.json();

  if (!data.success || !data.imageUrl) {
    throw new Error("Image upload returned an unexpected response");
  }

  return data.imageUrl;
}
