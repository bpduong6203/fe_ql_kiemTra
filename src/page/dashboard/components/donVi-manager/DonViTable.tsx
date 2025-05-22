import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'; 
import type { DonVi } from '@/types/interfaces';

interface DonViTableProps {
  filteredDonViList: DonVi[];
  loading: boolean;
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
  canEdit: boolean;
  canHardDelete: boolean;
  onView: (donVi: DonVi) => void;
  onEdit: (donVi: DonVi) => void;
  onDelete: (id: string, isHardDelete: boolean) => void;
}

export const DonViTable: React.FC<DonViTableProps> = ({
  filteredDonViList,
  loading,
  sortOrder,
  toggleSortOrder,
  canEdit,
  canHardDelete,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div>
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm">
      <table className="min-w-full border rounded-2xl shadow">
        <thead>
          <tr className="uppercase text-xs tracking-wide">
            <th
              className="px-4 py-3 text-left cursor-pointer font-medium transition-colors"
              onClick={toggleSortOrder}
            >
              Tên {sortOrder === 'asc' ? '↑' : '↓'}
            </th>
            <th className="px-4 py-3 text-left font-medium">Địa chỉ</th>
            <th className="px-4 py-3 text-left font-medium">Số điện thoại</th>
            <th className="px-4 py-3 text-left font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredDonViList.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-2 text-center text-sm text-muted-foreground">
                Không tìm thấy đơn vị.
              </td>
            </tr>
          ) : (
            filteredDonViList.map((donVi) => (
              <tr key={donVi.id} className="border-t hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <td className="px-4 py-2">{donVi.tenDonVi}</td>
                <td className="px-4 py-2">{donVi.diaChi || 'N/A'}</td>
                <td className="px-4 py-2">{donVi.soDienThoai || 'N/A'}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onView(donVi)}
                        variant="outline"
                        size="icon"
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Xem đơn vị
                    </TooltipContent>
                  </Tooltip>
                  {canEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onEdit(donVi)}
                          variant="outline"
                          size="icon"
                        >
                          <Edit className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Sửa đơn vị
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {canEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onDelete(donVi.id, false)}
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Xóa mềm đơn vị
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {canHardDelete && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onDelete(donVi.id, true)}
                          variant="destructive"
                          size="icon"
                          className="bg-red-700 hover:bg-red-800"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Xóa vĩnh viễn đơn vị
                      </TooltipContent>
                    </Tooltip>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};