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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DownloadIcon, Trash2Icon, FileTextIcon, XCircle } from 'lucide-react';
import { format } from 'date-fns';
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
  nguoiDungList,
  canEditGiaiTrinh,
  canUploadGiaiTrinhFile,
  canDeleteGiaiTrinhFile,
  onSubmitForm,
  handleSelectChange,
  handleLocalFilesChange,
  selectedLocalFiles,
  handleRemoveLocalFile,
  handleDeleteGiaiTrinhFile,
  handleDownloadFile,
  formData,
  loading,
}) => {
  const isCreateMode = currentGiaiTrinh === null;
  const isReadOnlyInfoMode = !isCreateMode && !canEditGiaiTrinh;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        {loading && <LoadingSpinner withOverlay={true} variant={2} />}
        <DialogHeader>
          <DialogTitle>{isCreateMode ? 'Tạo Yêu Cầu Giải Trình Mới' : 'Quản lý File Giải Trình'}</DialogTitle>
          <DialogDescription>
            {isCreateMode ? 'Chọn người giải trình và tải lên các tệp tài liệu (Word/PDF) cần yêu cầu.' : 'Thêm hoặc xóa tệp đính kèm cho giải trình.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmitForm} className="grid gap-4 py-4">

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nguoiGiaiTrinhID" className="text-right">
              Người Giải Trình
            </Label>
            {isReadOnlyInfoMode ? (
                <Input
                    value={currentGiaiTrinh?.nguoiGiaiTrinh?.hoTen || ''}
                    className="col-span-3"
                    readOnly
                    disabled
                />
            ) : (
                <Select
                    value={formData.nguoiGiaiTrinhID || ''}
                    onValueChange={(value) => handleSelectChange('nguoiGiaiTrinhID', value)}
                    disabled={loading || (!canEditGiaiTrinh && !isCreateMode)}
                >
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn người giải trình" />
                    </SelectTrigger>
                    <SelectContent>
                        {nguoiDungList.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                            {user.hoTen} ({user.username})
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
          </div>

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

            {!isCreateMode && currentGiaiTrinh && currentGiaiTrinh.giaiTrinhFiles.length > 0 && (
                <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tệp đã tải lên:</p>
                    <ul className="space-y-2">
                    {currentGiaiTrinh.giaiTrinhFiles.map((file) => (
                        <li key={file.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <FileTextIcon className="size-4 text-muted-foreground" />
                            <span>{file.tenFile}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                            ({format(new Date(file.ngayTao), 'dd/MM/yyyy')})
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