// src/page/dashboard/components/PlanInfo.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Mail, Notebook } from 'lucide-react';
import type { KeHoach } from '@/types/interfaces';

interface PlanInfoProps {
  keHoach: KeHoach;
}

const PlanInfo: React.FC<PlanInfoProps> = ({ keHoach }) => {
  return (
    <Card className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
          <Notebook className="h-5 w-5 text-primary" />
          Thông tin kế hoạch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Tên kế hoạch:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.tenKeHoach}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Ngày bắt đầu:</span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {new Date(keHoach.ngayBatDau).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Ngày kết thúc:</span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {new Date(keHoach.ngayKetThuc).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Notebook className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Ghi chú:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.ghiChu || 'Không có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Trạng thái:</span>
          <span
            className={`text-sm font-semibold ${
              keHoach.isDeleted ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {keHoach.isDeleted ? 'Đã xóa' : 'Hoạt động'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Người tạo:</span>
          <span className="text-neutral-900 dark:text-neutral-100">
            {keHoach.nguoiDung?.hoTen || 'N/A'} ({keHoach.nguoiDung?.username || 'N/A'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Email người tạo:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.nguoiDung?.email || 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanInfo;