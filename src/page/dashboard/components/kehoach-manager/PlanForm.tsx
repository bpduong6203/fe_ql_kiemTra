import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/ui/file-upload-props';
import { LoaiTaiLieuOptions } from '@/types/interfaces';

interface FileWithType {
  file: File;
  loaiTaiLieu: number;
}

interface PlanFormProps {
  planName: string;
  setPlanName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  files: FileWithType[];
  setFiles: (files: FileWithType[]) => void;
  notes: string;
  setNotes: (notes: string) => void;
  loaiTaiLieu: number;
  setLoaiTaiLieu: (value: number) => void;
  error: string | null;
  onSubmit: (e: React.FormEvent) => Promise<boolean>;
  isLoading: boolean;
  selectedUnit: string | null;
}

const PlanForm: React.FC<PlanFormProps> = ({
  planName,
  setPlanName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  files,
  setFiles,
  notes,
  setNotes,
  setLoaiTaiLieu,
  error,
  onSubmit,
  isLoading,
  selectedUnit,
}) => {
  const [resetFiles, setResetFiles] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await onSubmit(e);
      if (success) {
        // Chỉ reset nếu submit thành công
        setPlanName('');
        setStartDate('');
        setEndDate('');
        setNotes('');
        setLoaiTaiLieu(LoaiTaiLieuOptions[0].value);
        setResetFiles(true);
        setTimeout(() => setResetFiles(false), 0);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  // Kiểm tra xem form có hợp lệ để kích hoạt nút lưu
  const isFormValid = planName && startDate && endDate && selectedUnit && files.length > 0;

  return (
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
              disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          </div>
          <FileUpload onFilesChange={setFiles} reset={resetFiles} isLoading={isLoading} />
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi Chú</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú (nếu có)"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="mt-4" type="submit" disabled={isLoading || !isFormValid}>
            {isLoading ? 'Đang lưu...' : 'Lưu Kế Hoạch'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PlanForm;