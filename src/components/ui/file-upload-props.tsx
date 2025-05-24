import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaiTaiLieuOptions } from "@/types/interfaces";

interface FileWithType {
  file: File;
  loaiTaiLieu: number;
}

interface FileUploadProps {
  onFilesChange: (files: FileWithType[]) => void;
  reset?: boolean;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, reset, isLoading }) => {
  const [files, setFiles] = useState<FileWithType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reset) {
      setFiles([]);
      onFilesChange([]);
      setError(null);
    }
  }, [reset, onFilesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Không có file nào được chọn.");
      return;
    }

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ];
    const validFiles: FileWithType[] = [];
    const invalidFiles: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      if (validTypes.includes(file.type)) {
        validFiles.push({ file, loaiTaiLieu: LoaiTaiLieuOptions[0]?.value ?? 1 });
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`File không hợp lệ: ${invalidFiles.join(", ")}. Chỉ chấp nhận .docx hoặc .pdf.`);
    } else {
      setError(null);
    }

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles];
      setFiles(newFiles);
      onFilesChange(newFiles);
    }

    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleLoaiTaiLieuChange = (index: number, value: string) => {
    const newFiles = [...files];
    newFiles[index].loaiTaiLieu = Number(value);
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
        disabled={isLoading}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium">Danh sách file:</p>
          <ul className="mt-1 space-y-1">
            {files.map((item, index) => (
              <li
                key={`${item.file.name}-${index}`}
                className="flex items-center pl-4 mb-2 justify-between text-sm bg-neutral-50 dark:bg-neutral-800 rounded-md"
              >
                <div className="truncate max-w-[200px]">
                  <span>{item.file.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={item.loaiTaiLieu.toString()}
                    onValueChange={(value) => handleLoaiTaiLieuChange(index, value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn loại tài liệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {LoaiTaiLieuOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="text-destructive"
                    disabled={isLoading}
                  >
                    <XIcon className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;