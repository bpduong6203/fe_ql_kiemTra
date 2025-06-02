import * as React from 'react';
import GenericModal from '@/components/generic-modal'; 
import { getPhanCongFields } from './phanCongFields'; 
import type { PhanCongUser, NguoiDung } from '@/types/interfaces';

interface PhanCongModalFormValues {
    userID: string;
    noiDungCV: string;
    file?: string | File | null; 
  }
  
  interface PhanCongModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    selectedPhanCong: PhanCongUser | null;
    nguoiDungList: NguoiDung[];
    onSave: (data: {
      userID: string;
      noiDungCV: string;
      file?: File | null; 
      currentLinkFile?: string; 
    }) => Promise<void>;
  }
  
  export const PhanCongModal: React.FC<PhanCongModalProps> = ({
    isOpen,
    onClose,
    mode,
    selectedPhanCong,
    nguoiDungList,
    onSave,
  }) => {
    const phanCongFields = getPhanCongFields(nguoiDungList);
  
    const initialDataForModal: PhanCongModalFormValues = selectedPhanCong ? {
      userID: selectedPhanCong.userID,
      noiDungCV: selectedPhanCong.noiDungCV,
      file: selectedPhanCong.linkFile || null, 
    } : {
      userID: '',
      noiDungCV: '',
      file: null,
    };

    const handleSaveWrapper = async (data: PhanCongModalFormValues) => {
      const fileToUpload = data.file instanceof File ? data.file : null; 
      const currentLinkFileFromModal = typeof data.file === 'string' ? data.file : selectedPhanCong?.linkFile;
  
      await onSave({ 
        userID: data.userID,
        noiDungCV: data.noiDungCV,
        file: fileToUpload, 
        currentLinkFile: currentLinkFileFromModal, 
      });
    };
  
    return (
      <GenericModal<PhanCongModalFormValues> 
        isOpen={isOpen}
        onClose={onClose}
        title={mode === 'create' ? 'Tạo mới phân công' : 'Chỉnh sửa phân công'}
        initialData={initialDataForModal}
        fields={phanCongFields}
        apiEndpoint={mode === 'create' ? '/PhanCongUser' : `/PhanCongUser/${selectedPhanCong?.id}`}
        method={mode === 'create' ? 'POST' : 'PUT'}
        onSave={handleSaveWrapper} 
      />
    );
  };