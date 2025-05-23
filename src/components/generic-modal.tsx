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
  apiEndpoint,
  method = "POST",
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
      setFileData(null);
      setPreviewURL(null);
    }
  }, [stableInitialData, fields.length]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        setError("Chỉ hỗ trợ JPEG, PNG, hoặc GIF");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ảnh phải nhỏ hơn 5MB");
        return;
      }
      setFileData(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    // Kiểm tra các trường bắt buộc
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setError(`Vui lòng nhập ${field.label}`);
        return;
      }
    }

    // Kiểm tra email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email không hợp lệ");
      return;
    }

    // Kiểm tra mật khẩu
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

    // Kiểm tra xác nhận mật khẩu
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
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
        setPreviewURL(null);
      }
      onClose(); // Đóng modal khi lưu thành công
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <LoadingSpinner variant={1} />
        </div>
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
                      <>
                        <Input
                          id={field.name}
                          type="file"
                          name={field.name}
                          accept="image/jpeg,image/png,image/gif"
                          onChange={handleFileChange}
                          placeholder={field.placeholder}
                          disabled={isLoading}
                        />
                        {(previewURL || (field.name === "image" && formData[field.name])) && (
                          <img
                            src={
                              previewURL ||
                              (formData[field.name]
                                ? `${process.env.NEXT_PUBLIC_IMG_URL}${formData[field.name]}`
                                : "/images/default-course.png")
                            }
                            alt="Preview"
                            className="mt-2 rounded border"
                            style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}
                          />
                        )}
                      </>
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