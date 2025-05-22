import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="fixed inset-0 bg-[rgba(94,94,94,0.5)] flex items-center justify-center z-50">
      <Card className="w-full max-w-[600px]">
        <CardHeader>
          <CardTitle>Xem người dùng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {fields.map((field) => (
              <div key={field.label} className="grid grid-cols-3 gap-2">
                <Label className="font-medium col-span-1">{field.label}</Label>
                <div className="col-span-2">{field.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="button" variant="destructive" onClick={onClose}>
            Đóng
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};