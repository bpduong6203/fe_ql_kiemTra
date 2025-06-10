import React, { useState, useEffect } from 'react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { KeHoach, DonVi } from '@/types/interfaces';

interface KeHoachFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<KeHoach>, mode: 'create' | 'edit', id?: string) => Promise<void>;
  initialData?: Partial<KeHoach> | null;
  donViList: DonVi[];
  loading: boolean;
}

const KeHoachFormModal: React.FC<KeHoachFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  donViList, 
  loading,
}) => {
  const [formData, setFormData] = useState<Partial<KeHoach>>({
    tenKeHoach: '',
    donViID: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    ghiChu: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      const currentDonViId = initialData.donViID;
      const isValidDonViId = donViList.some(donVi => donVi.id === currentDonViId);

      setFormData({
        id: initialData.id,
        tenKeHoach: initialData.tenKeHoach || '',
        donViID: isValidDonViId ? currentDonViId : '',
        ngayBatDau: initialData.ngayBatDau ? format(new Date(initialData.ngayBatDau), 'yyyy-MM-dd') : '',
        ngayKetThuc: initialData.ngayKetThuc ? format(new Date(initialData.ngayKetThuc), 'yyyy-MM-dd') : '',
        ghiChu: initialData.ghiChu || '',
      });
      setErrors({});
    } else if (isOpen) {
      // Khi mở modal ở chế độ tạo mới
      setFormData({
        tenKeHoach: '',
        donViID: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        ghiChu: '',
      });
      setErrors({});
    }
    // Debugging logs
    console.log('KeHoachFormModal: initialData', initialData);
    console.log('KeHoachFormModal: donViList', donViList);
    console.log('KeHoachFormModal: formData after effect', formData);

  }, [isOpen, initialData, donViList]); // <-- THÊM donViList vào dependency array này

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.tenKeHoach) newErrors.tenKeHoach = 'Tên kế hoạch là bắt buộc.';
    if (!formData.donViID) newErrors.donViId = 'Đơn vị là bắt buộc.';
    if (!formData.ngayBatDau) newErrors.ngayBatDau = 'Ngày bắt đầu là bắt buộc.';
    if (!formData.ngayKetThuc) newErrors.ngayKetThuc = 'Ngày kết thúc là bắt buộc.';
    if (formData.ngayBatDau && formData.ngayKetThuc && new Date(formData.ngayBatDau) > new Date(formData.ngayKetThuc)) {
      newErrors.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, initialData ? 'edit' : 'create', initialData?.id);
      onClose();
    } catch (error) {
      // Lỗi đã được xử lý bởi useKeHoach hook (addToast)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{initialData ? 'Chỉnh sửa Kế hoạch' : 'Tạo mới Kế hoạch'}</SheetTitle>
          <SheetDescription>
            {initialData ? 'Cập nhật thông tin chi tiết của kế hoạch.' : 'Tạo một kế hoạch kiểm tra mới.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tenKeHoach" className="text-right">
              Tên kế hoạch
            </Label>
            <Input
              id="tenKeHoach"
              name="tenKeHoach"
              value={formData.tenKeHoach || ''}
              onChange={handleChange}
              className="col-span-3"
            />
            {errors.tenKeHoach && <p className="col-span-4 text-right text-red-500 text-sm">{errors.tenKeHoach}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="donViId" className="text-right">
              Đơn vị
            </Label>
            <Select
              name="donViId"
              value={formData.donViID || ''}
              onValueChange={(value) => handleSelectChange(value, 'donViId')}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn đơn vị" />
              </SelectTrigger>
              <SelectContent>
                {donViList.map((donVi) => (
                  <SelectItem key={donVi.id} value={donVi.id}>
                    {donVi.tenDonVi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.donViId && <p className="col-span-4 text-right text-red-500 text-sm">{errors.donViId}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ngayBatDau" className="text-right">
              Ngày bắt đầu
            </Label>
            <Input
              id="ngayBatDau"
              name="ngayBatDau"
              type="date"
              value={formData.ngayBatDau || ''}
              onChange={handleChange}
              className="col-span-3"
            />
            {errors.ngayBatDau && <p className="col-span-4 text-right text-red-500 text-sm">{errors.ngayBatDau}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ngayKetThuc" className="text-right">
              Ngày kết thúc
            </Label>
            <Input
              id="ngayKetThuc"
              name="ngayKetThuc"
              type="date"
              value={formData.ngayKetThuc || ''}
              onChange={handleChange}
              className="col-span-3"
            />
            {errors.ngayKetThuc && <p className="col-span-4 text-right text-red-500 text-sm">{errors.ngayKetThuc}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ghiChu" className="text-right">
              Ghi chú
            </Label>
            <Input
              id="ghiChu"
              name="ghiChu"
              value={formData.ghiChu || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
          </SheetClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || loading}>
            {isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : initialData ? 'Cập nhật' : 'Tạo'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default KeHoachFormModal;