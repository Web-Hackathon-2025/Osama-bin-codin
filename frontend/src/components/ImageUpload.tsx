import { IKContext, IKUpload } from "imagekitio-react";
import { useState, useRef } from "react";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: any) => void;
  currentImage?: string;
  folder?: string;
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadError,
  currentImage,
  folder = "/avatars",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [error, setError] = useState("");
  const ikUploadRef = useRef<any>(null);

  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

  const onError = (err: any) => {
    console.error("ImageKit upload error:", err);
    setError(err.message || "Failed to upload image");
    setUploading(false);
    if (onUploadError) {
      onUploadError(err);
    }
  };

  const onSuccess = (res: any) => {
    console.log("ImageKit upload success:", res);
    setPreview(res.url);
    setUploading(false);
    setError("");
    onUploadSuccess(res.url);
  };

  const onUploadStart = () => {
    setUploading(true);
    setError("");
  };

  const handleButtonClick = () => {
    if (ikUploadRef.current) {
      ikUploadRef.current.click();
    }
  };

  const validateFile = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, GIF, or WebP)");
      return false;
    }

    if (file.size > maxSize) {
      setError("Image size should be less than 5MB");
      return false;
    }

    return true;
  };

  const onFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && !validateFile(file)) {
      event.target.value = "";
    }
  };

  if (!publicKey || !urlEndpoint || publicKey === "your_public_key_here") {
    return (
      <div className="text-center p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
        <p className="text-red-600 font-medium">ImageKit not configured</p>
        <p className="text-sm text-red-500 mt-2">
          Please add your ImageKit credentials to .env file
        </p>
        <p className="text-xs text-gray-600 mt-2">
          See IMAGEKIT_SETUP_GUIDE.md for instructions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint}>
        <div className="flex flex-col items-center space-y-4">
          {/* Preview */}
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Uploading..."
              : preview
              ? "Change Image"
              : "Upload Image"}
          </button>

          {/* Hidden Upload Input */}
          <div style={{ display: "none" }}>
            <IKUpload
              ref={ikUploadRef}
              fileName="avatar.jpg"
              folder={folder}
              onError={onError}
              onSuccess={onSuccess}
              onUploadStart={onUploadStart}
              onChange={onFileChange}
              validateFile={validateFile}
              useUniqueFileName={true}
              isPrivateFile={false}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center">
            Max size: 5MB. Formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      </IKContext>
    </div>
  );
}
