import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload-props";

interface PlanFormProps {
  planName: string;
  setPlanName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  notes: string;
  setNotes: (notes: string) => void;
  error: string | null; 
  onSubmit: (e: React.FormEvent) => void;
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
  error,
  onSubmit,
}) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Tạo Kế Hoạch</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
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
  );
};

export default PlanForm;