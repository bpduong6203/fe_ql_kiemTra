import * as React from "react";

function ImageUploader() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewURL, setPreviewURL] = React.useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = React.useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const response = await fetch("http://localhost:4000/cdn/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Upload successful! URL: " + data.data);
      } else {
        setUploadStatus("Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("An error occurred during upload.");
    }
  };

  return (
    <div className="image-uploader">
      <h2>Upload Your Avatar</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />
      {previewURL && (
        <div>
          <img
            src={previewURL}
            alt="Preview"
            className="preview-image"
            style={{ width: "10px", height: "10px", marginTop: "4px" }}
          />
        </div>
      )}
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}

export { ImageUploader };
