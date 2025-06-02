import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import InputError from "@/components/input-error";
import LoadingSpinner from "@/components/loading-spinner";
import type { Field } from "@/types/interfaces";
import { XIcon } from "lucide-react";

interface GenericModalProps<T extends Record<string, any>> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: T;
  fields: Field[];
  apiEndpoint: string;
  method?: "POST" | "PUT" | "PATCH";
  onSave: (data: T & { file?: File | null }) => Promise<void>;
  children?: React.ReactNode;
}

const GenericModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  title,
  initialData = {} as T,
  fields,
  onSave,
  children,
}: GenericModalProps<T>) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [fileData, setFileData] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const stableInitialData = useMemo(() => initialData, [initialData]);

  useEffect(() => {
    if (fields.length > 0) {
      setFormData(stableInitialData);
      setFileData(null); // Reset fileData

      const fileField = fields.find(f => f.type === 'file');
      if (fileField && stableInitialData[fileField.name] && typeof stableInitialData[fileField.name] === 'string') {
        setPreviewURL(stableInitialData[fileField.name]);
      } else {
        setPreviewURL(null); 
      }
    }
  }, [stableInitialData, fields]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError(null); 
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null); 
    if (file) {
      const allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedFileTypes.includes(file.type)) {
        setError("Chỉ hỗ trợ JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX.");
        e.target.value = ''; 
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File phải nhỏ hơn 5MB.");
        e.target.value = ''; 
        return;
      }
      setFileData(file);
      setPreviewURL(URL.createObjectURL(file)); e
      setFormData({ ...formData, [e.target.name]: file.name });
    } else {
      setFileData(null);
      setPreviewURL(null);
      setFormData({ ...formData, [e.target.name]: '' });
    }
  };

  const handleRemoveFile = (fieldName: string) => {
    setFileData(null);
    if (previewURL && previewURL.startsWith('blob:')) {
      URL.revokeObjectURL(previewURL);
    }
    setPreviewURL(null);
    setFormData({ ...formData, [fieldName]: '' }); 
    setError(null); 
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setError(null); 
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    for (const field of fields) {
      if (field.required) {
        if (field.type === 'file' && !fileData && !formData[field.name]) {
          setError(`Vui lòng chọn ${field.label}`);
          return;
        } else if (field.type !== 'file' && !formData[field.name]) {
          setError(`Vui lòng nhập ${field.label}`);
          return;
        }
      }
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email không hợp lệ");
      return;
    }

    // Password validation
    if (formData.password) {
      const password = formData.password;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "Mật khẩu phải dài ít nhất 8 ký tự, chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt (!@#$%^&*)"
        );
        return;
      }
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave({ ...formData, file: fileData });
      setFormData(stableInitialData);
      setFileData(null);
      if (previewURL && previewURL.startsWith('blob:')) { 
        URL.revokeObjectURL(previewURL);
      }
      setPreviewURL(null);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isLoading && (
          <LoadingSpinner variant={2} />
      )}
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        {fields.length > 0 ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-between">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={`space-y-1 ${field.inline ? "w-[calc(50%-0.5rem)]" : "w-full"}`}
                  >
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-primary/50"
                        placeholder={field.placeholder}
                        disabled={isLoading}
                      />
                    ) : field.type === "select" ? (
                      <Select
                        onValueChange={handleSelectChange(field.name)}
                        defaultValue={String(formData[field.name] || "")}
                        disabled={isLoading}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue placeholder={field.placeholder || "Chọn..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "file" ? (
                      <div className="flex flex-col gap-2">
                        <Input
                          id={field.name}
                          type="file"
                          name={field.name}
                          accept="image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          onChange={handleFileChange}
                          placeholder={field.placeholder}
                          disabled={isLoading}
                          className="file:text-sm file:font-medium file:cursor-pointer"
                        />

                        {(previewURL || (formData[field.name] && typeof formData[field.name] === 'string')) && (
                          <div className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                            <div className="flex items-center gap-2 truncate">
                              {fileData && ["image/jpeg", "image/png", "image/gif"].includes(fileData.type) ? (
                                <img
                                  src={previewURL!}
                                  alt="Preview"
                                  className="size-8 object-cover rounded"
                                />
                              ) : (
                                <span className="text-sm font-medium truncate">
                                  {fileData ? fileData.name : (formData[field.name] as string).split('/').pop()}
                                </span>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(field.name)}
                              className="text-destructive p-1 h-auto"
                              disabled={isLoading}
                            >
                              <XIcon className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        disabled={field.disabled || isLoading}
                        readOnly={field.readOnly}
                        className="focus:ring focus:ring-primary/50"
                      />
                    )}
                  </div>
                ))}
              </div>
              <InputError message={error ?? undefined} />
            </div>
            <DialogFooter className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            {children}
            <DialogFooter className="justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenericModal;