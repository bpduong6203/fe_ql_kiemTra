import GenericModal from '@/components/generic-modal';
import { donViFields } from './donViFields';
import type { DonVi } from '@/types/interfaces';

interface DonViModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'create';
  selectedDonVi: DonVi | null;
  onSave: (data: any) => Promise<void>;
}

export const DonViModal: React.FC<DonViModalProps> = ({ isOpen, onClose, mode, selectedDonVi, onSave }) => {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Sửa đơn vị' : 'Tạo đơn vị mới'}
      initialData={selectedDonVi || {}}
      fields={donViFields}
      apiEndpoint={selectedDonVi ? `/donvi/${selectedDonVi.id}` : '/donvi'}
      method={mode === 'create' ? 'POST' : 'PUT'}
      onSave={onSave}
    />
  );
};