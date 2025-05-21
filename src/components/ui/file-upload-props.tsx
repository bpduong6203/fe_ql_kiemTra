import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { XIcon } from "lucide-react";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
      ];
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      // Duyệt qua tất cả các file được chọn
      Array.from(selectedFiles).forEach((file) => {
        if (validTypes.includes(file.type)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        const errorMsg = `File không hợp lệ: ${invalidFiles.join(", ")}. Chỉ chấp nhận .docx hoặc .pdf.`;
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        setError(null);
      }

      if (validFiles.length > 0) {
        const newFiles = [...files, ...validFiles];
        setFiles(newFiles);
        onFilesChange(newFiles);
      }

      // Reset input file để cho phép chọn lại cùng file
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file">Tải Lên File Word/PDF</Label>
      <Input
        id="file"
        type="file"
        accept=".docx,.pdf"
        multiple
        onChange={handleFileChange}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium">Danh sách file:</p>
          <ul className="mt-1 space-y-1">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm bg-neutral-50 rounded-md">
                <span>{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  className="text-destructive"
                >
                  <XIcon className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;