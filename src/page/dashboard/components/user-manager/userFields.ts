import type { Field } from '@/types/interfaces';

export const userFields: Field[] = [
  { name: 'username', label: 'Tên đăng nhập', type: 'text', required: true },
  { name: 'password', label: 'Mật khẩu', type: 'password', required: true, inline: true},
  { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', required: true , inline: true},
  { name: 'hoTen', label: 'Họ tên', type: 'text' },
  { name: 'email', label: 'Email', type: 'email', inline: true, required: true },
  { name: 'soDienThoai', label: 'Số điện thoại', type: 'text', inline: true },
  { name: 'diaChi', label: 'Địa chỉ', type: 'text' },
  {
    name: 'roleID',
    label: 'Vai trò',
    type: 'select',
    options: [],
    required: true,
    inline: true,
  },
  {
    name: 'donViID',
    label: 'Đơn vị',
    type: 'select',
    options: [],
    inline: true,
  },
];