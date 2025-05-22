import type { Field } from '@/types/interfaces';

export const donViFields: Field[] = [
  { name: 'tenDonVi', label: 'Tên đơn vị', type: 'text', required: true },
  { name: 'diaChi', label: 'Địa chỉ', type: 'text' },
  { name: 'soDienThoai', label: 'Số điện thoại', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'nguoiDaiDien', label: 'Người đại diện', type: 'text' },
  { name: 'chucVuNguoiDaiDien', label: 'Chức vụ người đại diện', type: 'text' },
];