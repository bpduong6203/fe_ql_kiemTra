import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { PhanCongUser } from '@/types/interfaces';

interface PhanCongTableProps {
  filteredPhanCongList: PhanCongUser[];
  loading: boolean;
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
  canEdit: boolean;
  canHardDelete: boolean; 
  onView: (phanCong: PhanCongUser) => void;
  onEdit: (phanCong: PhanCongUser) => void;
  onDelete: (id: string) => void;
}

export const PhanCongTable: React.FC<PhanCongTableProps> = ({
  filteredPhanCongList,
  loading,
  sortOrder,
  toggleSortOrder,
  canEdit,
  onView,
  onEdit,
  onDelete,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedPhanCongId, setSelectedPhanCongId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedPhanCongId(id);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPhanCongId) {
      onDelete(selectedPhanCongId);
      setAlertOpen(false);
      setSelectedPhanCongId(null);
    }
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const getDownloadUrl = (linkFile: string) => {
    if (linkFile.startsWith('http://') || linkFile.startsWith('https://')) {
      return linkFile;
    }
    return `${baseUrl}${linkFile.startsWith('/') ? '' : '/'}${linkFile}`;
  };

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
    <>
      <div className="overflow-x-auto rounded-sm">
        <table className="min-w-full border rounded-2xl shadow">
          <thead>
            <tr className="uppercase text-xs tracking-wide">
              <th
                className="px-4 py-3 text-left cursor-pointer font-medium transition-colors"
                onClick={toggleSortOrder}
              >
                Người dùng {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th className="px-4 py-3 text-left font-medium">Nội dung công việc</th>
              <th className="px-4 py-3 text-left font-medium">File</th>
              <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
              <th className="px-4 py-3 text-left font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredPhanCongList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center text-sm text-muted-foreground">
                  Không tìm thấy phân công nào.
                </td>
              </tr>
            ) : (
              filteredPhanCongList.map((phanCong) => (
                <tr key={phanCong.id} className="border-t hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <td className="px-4 py-2">{phanCong.nguoiDung.hoTen} ({phanCong.nguoiDung.username})</td>
                  <td className="px-4 py-2 line-clamp-1">{phanCong.noiDungCV}</td>
                  <td className="px-4 py-2">
                    {phanCong.linkFile ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" asChild>
                            <a
                              href={getDownloadUrl(phanCong.linkFile)}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              aria-label={`Tải xuống file ${phanCong.linkFile.split('/').pop()}`}
                            >
                              <Download className="size-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Tải xuống file</TooltipContent>
                      </Tooltip>
                    ) : (
                      'Không có file'
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {phanCong.ngayTao ? new Date(phanCong.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onView(phanCong)}
                          variant="outline"
                          size="icon"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xem chi tiết</TooltipContent>
                    </Tooltip>
                    {canEdit && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => onEdit(phanCong)}
                            variant="outline"
                            size="icon"
                          >
                            <Edit className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sửa phân công</TooltipContent>
                      </Tooltip>
                    )}
                    {canEdit && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleDeleteClick(phanCong.id)}
                            variant="destructive"
                            size="icon"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Xóa phân công</TooltipContent>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Xác nhận xóa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
                Bạn có chắc chắn muốn xóa phân công này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2">Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};