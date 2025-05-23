import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { NguoiDung, Roles, DonVi } from '@/types/interfaces';

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: NguoiDung | null;
  rolesList: Roles[];
  donViList: DonVi[];
}

export const UserViewModal: React.FC<UserViewModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  rolesList,
  donViList,
}) => {
  if (!isOpen || !selectedUser) return null;

  const roleName = rolesList.find((role) => role.id === selectedUser.roleID)?.ten || 'N/A';
  const donViName = donViList.find((donVi) => donVi.id === selectedUser.donViID)?.tenDonVi || 'N/A';

  const fields = [
    { label: 'Tên đăng nhập', value: selectedUser.username || 'N/A' },
    { label: 'Họ tên', value: selectedUser.hoTen || 'N/A' },
    { label: 'Email', value: selectedUser.email || 'N/A' },
    { label: 'Số điện thoại', value: selectedUser.soDienThoai || 'N/A' },
    { label: 'Địa chỉ', value: selectedUser.diaChi || 'N/A' },
    { label: 'Vai trò', value: roleName },
    { label: 'Đơn vị', value: donViName },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Xem người dùng</DialogTitle>
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
