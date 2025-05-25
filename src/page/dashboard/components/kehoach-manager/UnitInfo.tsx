// src/page/dashboard/components/UnitInfo.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Phone, Mail, User, Briefcase } from 'lucide-react';
import type { KeHoach } from '@/types/interfaces';

interface UnitInfoProps {
  keHoach: KeHoach;
}

const UnitInfo: React.FC<UnitInfoProps> = ({ keHoach }) => {
  return (
    <Card className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Thông tin đơn vị
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Tên đơn vị:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.donVi?.tenDonVi || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Địa chỉ:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.donVi?.diaChi || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Số điện thoại:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.donVi?.soDienThoai || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Email:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.donVi?.email || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Người đại diện:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.donVi?.nguoiDaiDien || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Chức vụ:</span>
          <span className="text-neutral-900 dark:text-neutral-100">{keHoach.donVi?.chucVuNguoiDaiDien || 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitInfo;