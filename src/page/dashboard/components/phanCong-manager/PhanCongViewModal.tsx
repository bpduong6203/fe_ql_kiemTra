import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label'; 
import { Separator } from '@/components/ui/separator'; 
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { PhanCongUser } from '@/types/interfaces';

interface PhanCongViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhanCong: PhanCongUser | null;
}

export const PhanCongViewModal: React.FC<PhanCongViewModalProps> = ({
  isOpen,
  onClose,
  selectedPhanCong,
}) => {
  if (!isOpen || !selectedPhanCong) return null;

  const fields = [
    { label: 'Người dùng', value: `${selectedPhanCong.nguoiDung.hoTen} (${selectedPhanCong.nguoiDung.username})` },
    { label: 'Kế hoạch', value: selectedPhanCong.keHoach.tenKeHoach },
    { label: 'Nội dung công việc', value: selectedPhanCong.noiDungCV, multiline: true },
    { label: 'Ngày tạo', value: selectedPhanCong.ngayTao ? new Date(selectedPhanCong.ngayTao).toLocaleDateString('vi-VN') : 'N/A' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Chi tiết phân công</DialogTitle>
          <DialogDescription>Thông tin chi tiết về phân công đã chọn.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            {fields.map((field) => (
              <React.Fragment key={field.label}>
                <div className="grid grid-cols-3 gap-2 items-start"> 
                  <Label className="font-medium col-span-1">{field.label}</Label>
                  <div className="col-span-2 break-words">
                    {field.multiline ? (
                      <p className="whitespace-pre-wrap">{field.value}</p> 
                    ) : (
                      field.value
                    )}
                  </div>
                </div>
                <Separator /> 
              </React.Fragment>
            ))}

            <div className="grid grid-cols-3 gap-2 items-center">
              <Label className="font-medium col-span-1">File đính kèm</Label>
              <div className="col-span-2">
                {selectedPhanCong.linkFile ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={selectedPhanCong.linkFile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <Download className="size-4" /> Tải xuống file
                    </a>
                  </Button>
                ) : (
                  'Không có file'
                )}
              </div>
            </div>
            <Separator />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};