import GenericModal from '@/components/generic-modal';
import { donViFields } from './donViFields';
import type { DonVi } from '@/types/interfaces';

interface DonViModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'create';
  selectedDonVi: DonVi | null;
  onSave: (data: any) => Promise<void>;
}

export const DonViModal: React.FC<DonViModalProps> = ({ isOpen, onClose, mode, selectedDonVi, onSave }) => {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'view' ? 'Xem đơn vị' :
        mode === 'edit' ? 'Sửa đơn vị' : 'Tạo đơn vị mới'
      }
      initialData={selectedDonVi || {}}
      fields={donViFields.map(field => ({
        ...field,
        disabled: mode === 'view'
      }))}
      apiEndpoint={selectedDonVi ? `/donvi/${selectedDonVi.id}` : '/donvi'}
      method={mode === 'create' ? 'POST' : 'PUT'}
      onSave={mode === 'view' ? async () => {} : onSave}
    />
  );
};