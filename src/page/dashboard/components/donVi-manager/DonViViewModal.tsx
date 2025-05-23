import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { DonVi } from '@/types/interfaces';

interface DonViViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDonVi: DonVi | null;
}

export const DonViViewModal: React.FC<DonViViewModalProps> = ({
  isOpen,
  onClose,
  selectedDonVi,
}) => {
  if (!isOpen || !selectedDonVi) return null;

  const fields = [
    { label: 'Tên đơn vị', value: selectedDonVi.tenDonVi || 'N/A' },
    { label: 'Địa chỉ', value: selectedDonVi.diaChi || 'N/A' },
    { label: 'Số điện thoại', value: selectedDonVi.soDienThoai || 'N/A' },
    { label: 'Email', value: selectedDonVi.email || 'N/A' },
    { label: 'Người đại diện', value: selectedDonVi.nguoiDaiDien || 'N/A' },
    { label: 'Chức vụ người đại diện', value: selectedDonVi.chucVuNguoiDaiDien || 'N/A' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Xem đơn vị</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            {fields.map((field) => (
              <div key={field.label} className="grid grid-cols-3 gap-2">
                <Label className="font-medium col-span-1">{field.label}</Label>
                <div className="col-span-2">{field.value}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};