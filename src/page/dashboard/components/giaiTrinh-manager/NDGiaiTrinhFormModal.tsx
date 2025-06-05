import React, { useState, useEffect } from 'react';
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
import { DownloadIcon, FileTextIcon, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { NDGiaiTrinh } from '@/types/interfaces';
import LoadingSpinner from '@/components/loading-spinner';
import { Badge } from '@/components/ui/badge';

interface NDGiaiTrinhFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNDGiaiTrinh: NDGiaiTrinh | null; 
  giaiTrinhId: string; 
  loading: boolean;
  selectedNDFile: File | null;
  handleNDFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveNDFile: () => void;
  onSaveNDGiaiTrinh: (data: { NoiDung: string; GiaiTrinhID: string; }, ndGiaiTrinhId: string | null) => Promise<void>;
  getDownloadUrl: (linkFile: string) => string;
}

export const NDGiaiTrinhFormModal: React.FC<NDGiaiTrinhFormModalProps> = ({
  isOpen,
  onClose,
  currentNDGiaiTrinh,
  giaiTrinhId,
  loading,
  selectedNDFile,
  handleNDFileChange,
  handleRemoveNDFile,
  onSaveNDGiaiTrinh,
  getDownloadUrl,
}) => {
  const isCreateMode = currentNDGiaiTrinh === null;
  const [noiDung, setNoiDung] = useState<string>('');

  useEffect(() => {
    if (currentNDGiaiTrinh) {
      setNoiDung(currentNDGiaiTrinh.noiDung || '');
    } else {
      setNoiDung('');
    }
    handleRemoveNDFile(); 
  }, [currentNDGiaiTrinh, handleRemoveNDFile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noiDung.trim() && !selectedNDFile && !currentNDGiaiTrinh?.linkFile) {
        onClose(); 
        return;
    }
    await onSaveNDGiaiTrinh(
        { NoiDung: noiDung, GiaiTrinhID: giaiTrinhId },
        currentNDGiaiTrinh?.id || null
    );
    onClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {loading && <LoadingSpinner withOverlay={true} variant={1} />}
        <DialogHeader>
          <DialogTitle>{isCreateMode ? 'Thêm Nội Dung Giải Trình Mới' : 'Chi Tiết Nội Dung Giải Trình'}</DialogTitle>
          <DialogDescription>
            {isCreateMode ? 'Nhập nội dung giải trình hoặc đính kèm tệp.' : 'Xem và chỉnh sửa nội dung giải trình.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="noiDung">Nội dung</Label>
            <Input
              id="noiDung"
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              placeholder="Nhập nội dung giải trình..."
              disabled={loading}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ndFileUpload">Tệp đính kèm (Word/PDF)</Label>
            <Input
              id="ndFileUpload"
              type="file"
              accept=".doc,.docx,.pdf"
              onChange={handleNDFileChange}
              disabled={loading}
            />
            {selectedNDFile && (
                <div className="flex items-center justify-between text-sm mt-2 p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                        <FileTextIcon className="size-4 text-muted-foreground" />
                        <span>{selectedNDFile.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" type="button" onClick={handleRemoveNDFile} disabled={loading}>
                        <XCircle className="size-4 text-destructive" />
                    </Button>
                </div>
            )}
            {!selectedNDFile && currentNDGiaiTrinh?.linkFile && currentNDGiaiTrinh?.tenFile && (
                <div className="flex items-center justify-between text-sm mt-2 p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                        <FileTextIcon className="size-4 text-muted-foreground" />
                        <span>{currentNDGiaiTrinh.tenFile}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getDownloadUrl(currentNDGiaiTrinh.linkFile!), '_blank')}
                        type="button"
                        disabled={loading}
                    >
                        <DownloadIcon className="size-4 text-primary" />
                    </Button>
                </div>
            )}
            {!selectedNDFile && !currentNDGiaiTrinh?.linkFile && (
                <p className="text-sm text-muted-foreground mt-1">Chưa có tệp đính kèm.</p>
            )}
          </div>

          {/* Thông tin đánh giá (chỉ hiển thị khi chỉnh sửa và đã có đánh giá) */}
          {!isCreateMode && currentNDGiaiTrinh && (
            <div className="grid gap-2 border-t pt-4 mt-4">
              <p className="text-sm font-medium">Trạng thái đánh giá: <Badge variant={trangThaiColors[currentNDGiaiTrinh.trangThai] || 'outline'}>{currentNDGiaiTrinh.trangThai}</Badge></p>
              {currentNDGiaiTrinh.nguoiDanhGia?.hoTen && (
                <p className="text-sm">Người đánh giá: {currentNDGiaiTrinh.nguoiDanhGia.hoTen}</p>
              )}
              {currentNDGiaiTrinh.ngayDanhGia && (
                <p className="text-sm">Ngày đánh giá: {format(new Date(currentNDGiaiTrinh.ngayDanhGia), 'dd/MM/yyyy HH:mm')}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {isCreateMode ? 'Thêm' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Định nghĩa trangThaiColors ở đây hoặc import từ đâu đó
const trangThaiColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'} = {
    'Chờ Đánh Giá': 'secondary',
    'Đạt': 'success',
    'Chưa Đạt': 'destructive',
    'Đã Sửa': 'default',
};