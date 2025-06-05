import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { DownloadIcon, Trash2Icon, FileTextIcon, XCircle } from 'lucide-react';
import type { GiaiTrinh, NguoiDung } from '@/types/interfaces';
import LoadingSpinner from '@/components/loading-spinner';

interface GiaiTrinhFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGiaiTrinh: GiaiTrinh | null; 
  nguoiDungList: NguoiDung[];
  selectedPlanName: string;
  canEditGiaiTrinh: boolean; 
  canUploadGiaiTrinhFile: boolean; 
  canDeleteGiaiTrinhFile: boolean; 
  onSubmitForm: (e: React.FormEvent<HTMLFormElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  
  handleLocalFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  selectedLocalFiles: File[]; 
  handleRemoveLocalFile: (index: number) => void; 
  handleDeleteGiaiTrinhFile: (fileId: string) => Promise<void>; 
  handleDownloadFile: (linkFile: string, fileName: string) => void;

  formData: Partial<{
    keHoachID: string;
    nguoiGiaiTrinhID: string;
    trangThaiTongThe?: string;
  }>;
  loading: boolean;
}

export const GiaiTrinhFormModal: React.FC<GiaiTrinhFormModalProps> = ({
  isOpen,
  onClose,
  currentGiaiTrinh,
  canUploadGiaiTrinhFile,
  canDeleteGiaiTrinhFile,
  onSubmitForm,
  handleLocalFilesChange,
  selectedLocalFiles,
  handleRemoveLocalFile,
  handleDeleteGiaiTrinhFile,
  handleDownloadFile,
  loading,
}) => {
  const isCreateMode = currentGiaiTrinh === null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {loading && <LoadingSpinner withOverlay={true} variant={2} />}
        <DialogHeader>
          <DialogTitle>{isCreateMode ? 'Tạo Yêu Cầu Giải Trình Mới' : 'Quản lý File Giải Trình'}</DialogTitle>
          <DialogDescription>
            {isCreateMode ? 'Chọn người giải trình và tải lên các tệp tài liệu (Word/PDF) cần yêu cầu.' : 'Thêm hoặc xóa tệp đính kèm cho giải trình.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmitForm} className="grid gap-4 py-4">

          {/* Phần quản lý tệp đính kèm */}
          <div className="col-span-4 mt-4 p-2 border rounded-md">
            <h4 className="font-semibold text-base mb-2">Tệp đính kèm (Word/PDF)</h4>
            
            {canUploadGiaiTrinhFile && (
                <div className="mb-4">
                    <Label htmlFor="localFileUpload" className="sr-only">Tải lên tệp mới</Label>
                    <Input
                        id="localFileUpload"
                        type="file"
                        multiple 
                        accept=".doc,.docx,.pdf"
                        className="flex-1"
                        onChange={handleLocalFilesChange}
                        disabled={loading}
                    />
                </div>
            )}

            {/* Danh sách các tệp đã chọn từ máy tính (chờ tải lên) */}
            {selectedLocalFiles.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tệp đang chờ tải lên:</p>
                    <ul className="space-y-1">
                        {selectedLocalFiles.map((file, index) => (
                            <li key={file.name + index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <FileTextIcon className="size-4 text-muted-foreground" />
                                    <span>{file.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveLocalFile(index)}
                                    type="button"
                                    disabled={loading}
                                >
                                    <XCircle className="size-4 text-destructive" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Danh sách các tệp đã được tải lên và lưu vào cơ sở dữ liệu */}
            {currentGiaiTrinh && currentGiaiTrinh.giaiTrinhFiles.length > 0 && (
                <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tệp đã tải lên:</p>
                    <ul className="space-y-2">
                    {currentGiaiTrinh.giaiTrinhFiles.map((file) => (
                        <li key={file.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <FileTextIcon className="size-4 text-muted-foreground" />
                            <span>{file.tenFile}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadFile(file.linkFile, file.tenFile)}
                                type="button"
                                disabled={loading}
                            >
                                <DownloadIcon className="size-4" />
                            </Button>
                            {canDeleteGiaiTrinhFile && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteGiaiTrinhFile(file.id)}
                                    type="button"
                                    disabled={loading}
                                >
                                    <Trash2Icon className="size-4" />
                                </Button>
                            )}
                        </div>
                        </li>
                    ))}
                    </ul>
                </div>
            )}
            
            {/* Thông báo nếu không có tệp nào cả */}
            {selectedLocalFiles.length === 0 && (!currentGiaiTrinh || currentGiaiTrinh.giaiTrinhFiles.length === 0) && (
                <p className="text-sm text-muted-foreground">Chưa có tệp nào được đính kèm.</p>
            )}

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {isCreateMode ? 'Gửi Yêu Cầu' : 'Lưu Thay Đổi File'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};