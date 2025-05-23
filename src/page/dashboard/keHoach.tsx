import * as React from "react";
import { useState } from "react";
import PlanForm from "./components/kehoach-manager/PlanForm";
import UnitSelection from "./components/kehoach-manager/UnitSelection";
import { useDonVi } from "./hooks/useDonVi";
import AppearanceToggleTab from "@/components/appearance-tabs";


const KeHoach: React.FC = () => {
  const [planName, setPlanName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { filteredDonViList, loading: unitsLoading } = useDonVi();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError(null); 

    if (!planName || !startDate || !endDate || !selectedUnit || files.length === 0) {
      setError("Vui lòng điền đầy đủ thông tin, chọn một đơn vị và tải lên ít nhất một file.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Ngày bắt đầu phải trước ngày kết thúc.");
      return;
    }

    console.log({ planName, startDate, endDate, files, notes, selectedUnit });
    alert("Kế hoạch đã được lưu thành công!"); 

    setPlanName("");
    setStartDate("");
    setEndDate("");
    setFiles([]);
    setNotes("");
    setSelectedUnit(null);
  };

  const unitsForSelection = React.useMemo(() => {
    return filteredDonViList.map(donVi => ({
      id: donVi.id, 
      name: donVi.tenDonVi 
    }));
  }, [filteredDonViList]);

  return (
    <div className="container mx-auto p-4">
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
          error={error}
          onSubmit={handleSubmit}
        />

        <UnitSelection
          units={unitsForSelection}
          loading={unitsLoading}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
        />
      </div>
    </div>
  );
};

export default KeHoach;