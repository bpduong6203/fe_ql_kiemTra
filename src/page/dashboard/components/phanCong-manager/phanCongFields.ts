import type { Field } from '@/types/interfaces';
import type { NguoiDung } from '@/types/interfaces';
interface PhanCongField extends Field {
  options?: { value: string; label: string }[];
}

export const getPhanCongFields = (nguoiDungList: NguoiDung[]): PhanCongField[] => [
  {
    name: 'userID',
    label: 'Người dùng',
    type: 'select',
    required: true,
    placeholder: 'Chọn người dùng',
    options: nguoiDungList.map(nguoiDung => ({
      value: nguoiDung.id,
      label: `${nguoiDung.hoTen} (${nguoiDung.username})`
    })),
  },
  {
    name: 'noiDungCV',
    label: 'Nội dung công việc',
    type: 'textarea',
    required: true,
    placeholder: 'Nhập nội dung công việc...',
  },
  {
    name: 'file', 
    label: 'File đính kèm',
    type: 'file',
    placeholder: 'Chọn file',
  },
];