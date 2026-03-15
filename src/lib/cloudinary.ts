export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();

  const cloudName = "dzcnlbzhg"; 
  const uploadPreset = "lilycrafts";

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset); 

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary Error Detail:", data);
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
}