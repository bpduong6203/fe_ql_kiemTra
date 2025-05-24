import * as React from 'react';
import { useState, useCallback } from 'react';
import PlanForm from './components/kehoach-manager/PlanForm';
import UnitSelection from './components/kehoach-manager/UnitSelection';
import { useDonVi } from './hooks/useDonVi';
import { useKeHoach } from './hooks/useKeHoach';
import { createTaiLieu } from '@/lib/apiTaiLieu';
import { uploadFile } from '@/lib/api';
import { LoaiTaiLieuOptions } from '@/types/interfaces';
import LoadingSpinner from '@/components/loading-spinner';
import { useToast } from '@/components/toast-provider';

interface FileWithType {
  file: File;
  loaiTaiLieu: number;
}

const KeHoachInner: React.FC = () => {
  const [planName, setPlanName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [files, setFiles] = useState<FileWithType[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [loaiTaiLieu, setLoaiTaiLieu] = useState<number>(LoaiTaiLieuOptions[0].value);
  const [error, setError] = useState<string | null>(null);
  const [unitError, setUnitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { donViList, loading: unitsLoading } = useDonVi();
  const { handleSave, canEdit } = useKeHoach();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<boolean> => {
      e.preventDefault();

      if (isLoading) return false;

      setError(null);
      setUnitError(null);
      setIsLoading(true);

      if (!canEdit) {
        setError('Bạn không có quyền tạo kế hoạch');
        setIsLoading(false);
        addToast('Bạn không có quyền tạo kế hoạch', 'error');
        return false;
      }

      if (!planName || !startDate || !endDate || !selectedUnit || files.length === 0) {
        if (!selectedUnit) {
          setUnitError('Vui lòng chọn một đơn vị');
        }
        setError('Vui lòng điền đầy đủ thông tin và tải lên ít nhất một file');
        setIsLoading(false);
        addToast('Vui lòng điền đầy đủ thông tin', 'error');
        return false;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setError('Ngày bắt đầu phải trước ngày kết thúc');
        setIsLoading(false);
        addToast('Ngày bắt đầu phải trước ngày kết thúc', 'error');
        return false;
      }

      try {
        const keHoachData = {
          tenKeHoach: planName,
          donViId: selectedUnit,
          ngayBatDau: new Date(startDate).toISOString(),
          ngayKetThuc: new Date(endDate).toISOString(),
          ghiChu: notes,
          files,
        };

        const newKeHoach = await handleSave(keHoachData, 'create');

        for (const item of files) {
          const uploadResult = await uploadFile(item.file);
          const fileUrl = uploadResult.url;

          if (!fileUrl) {
            console.warn(`File "${item.file.name}" không nhận được URL sau khi upload, bỏ qua.`);
            continue;
          }

          await createTaiLieu(item.file.name, fileUrl, newKeHoach.id, item.loaiTaiLieu);
        }

        addToast('Tạo kế hoạch và tải tài liệu thành công!', 'success');
        setIsLoading(false);
        setPlanName('');
        setStartDate('');
        setEndDate('');
        setFiles([]);
        setNotes('');
        setSelectedUnit(null);
        setLoaiTaiLieu(LoaiTaiLieuOptions[0].value);
        return true;
      } catch (error) {
        console.error('Error creating kế hoạch hoặc tài liệu:', error);
        setError('Lỗi khi lưu kế hoạch hoặc tài liệu. Vui lòng thử lại.');
        addToast('Lỗi khi lưu kế hoạch hoặc tài liệu!', 'error');
        setIsLoading(false);
        return false;
      }
    },
    [
      isLoading,
      canEdit,
      planName,
      startDate,
      endDate,
      selectedUnit,
      files,
      notes,
      handleSave,
      addToast,
    ]
  );

  const unitsForSelection = React.useMemo(() => {
    return donViList.map((donVi) => ({
      id: donVi.id,
      name: donVi.tenDonVi,
    }));
  }, [donViList]);

  return (
    <div className="container mx-auto p-4">
      {isLoading && <LoadingSpinner variant={2} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanForm
          planName={planName}
          setPlanName={setPlanName}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          files={files}
          setFiles={setFiles}
          notes={notes}
          setNotes={setNotes}
          loaiTaiLieu={loaiTaiLieu}
          setLoaiTaiLieu={setLoaiTaiLieu}
          error={error}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          selectedUnit={selectedUnit}
        />
        <UnitSelection
          units={unitsForSelection}
          loading={unitsLoading}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
          error={unitError}
        />
      </div>
    </div>
  );
};

const KeHoach: React.FC = () => <KeHoachInner />;

export default KeHoach;