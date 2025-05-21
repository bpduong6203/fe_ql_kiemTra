import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUpload from "@/components/ui/file-upload-props";

interface Unit {
  id: string;
  name: string;
}

const KeHoach: React.FC = () => {
  const [planName, setPlanName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Giả lập lấy danh sách đơn vị
  useEffect(() => {
    setTimeout(() => {
      setUnits([
        { id: "1", name: "Đơn vị A" },
        { id: "2", name: "Đơn vị B" },
        { id: "3", name: "Đơn vị C" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUnitChange = (unitId: string) => {
    setSelectedUnit((prev) => (prev === unitId ? null : unitId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName || !startDate || !endDate || !selectedUnit || files.length === 0) {
      const errorMsg = "Vui lòng điền đầy đủ thông tin, chọn một đơn vị và tải lên ít nhất một file.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      const errorMsg = "Ngày bắt đầu phải trước ngày kết thúc.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setError(null);
    console.log({ planName, startDate, endDate, files, notes, selectedUnit });
    toast.success("Kế hoạch đã được lưu!");
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Kế Hoạch */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tạo Kế Hoạch</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="planName">Tên Kế Hoạch</Label>
                <Input
                  id="planName"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Nhập tên kế hoạch"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày Bắt Đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày Kết Thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <FileUpload onFilesChange={setFiles} />
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi Chú</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú (nếu có)"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="mt-4" type="submit">Lưu Kế Hoạch</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Danh Sách Đơn Vị */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn Đơn Vị</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {units.map((unit) => (
                  <div key={unit.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={unit.id}
                      checked={selectedUnit === unit.id}
                      onCheckedChange={() => handleUnitChange(unit.id)}
                    />
                    <Label htmlFor={unit.id}>{unit.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KeHoach;