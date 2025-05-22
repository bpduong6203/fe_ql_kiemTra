import GenericModal from '@/components/generic-modal';
import { userFields } from './userFields';
import type { NguoiDung, Roles, DonVi } from '@/types/interfaces';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'create';
  selectedUser: NguoiDung | null;
  rolesList: Roles[];
  donViList: DonVi[];
  onSave: (data: any) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  mode,
  selectedUser,
  rolesList,
  donViList,
  onSave,
}) => {
  const dynamicFields = userFields.map((field) => {
    if (field.name === 'roleID') {
      return {
        ...field,
        options: rolesList.map((role) => ({ value: role.id, label: role.ten })),
      };
    }
    if (field.name === 'donViID') {
      return {
        ...field,
        options: donViList.map((donVi) => ({ value: donVi.id, label: donVi.tenDonVi })),
      };
    }
    return field;
  });

  const initialData = {
    ...selectedUser,
    password: '',
    confirmPassword: '',
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Sửa người dùng' : 'Tạo người dùng mới'}
      initialData={initialData}
      fields={dynamicFields.map((field) => ({
        ...field,
        required: field.name === 'password' || field.name === 'confirmPassword' ? mode === 'create' : field.required,
        disabled: field.name === 'username' && mode === 'edit',
        placeholder:
          field.name === 'password' && mode === 'edit'
            ? 'Nhập mật khẩu mới'
            : field.name === 'confirmPassword' && mode === 'edit'
            ? 'Xác nhận mật khẩu mới'
            : field.placeholder,
      }))}
      apiEndpoint={selectedUser ? `/users/${selectedUser.id}` : '/users'}
      method={mode === 'create' ? 'POST' : 'PUT'}
      onSave={onSave}
    />
  );
};