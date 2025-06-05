import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; 
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

import type { GiaiTrinh } from '@/types/interfaces';
import { format } from 'date-fns';

interface GiaiTrinhTableProps {
  filteredGiaiTrinhList: GiaiTrinh[];
  loading: boolean;
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
  canEditGiaiTrinh: boolean;
  canDeleteGiaiTrinh: boolean;
  onView: (giaiTrinh: GiaiTrinh) => void;
  onDelete: (id: string) => void;
}

const trangThaiColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'} = {
  'Chờ Giải Trình': 'secondary',
  'Đã Giải Trình': 'default',
  'Đã Duyệt': 'success',
  'Từ Chối': 'destructive',
};

export const GiaiTrinhTable: React.FC<GiaiTrinhTableProps> = ({
  filteredGiaiTrinhList,
  loading,
  sortOrder,
  toggleSortOrder,
  canEditGiaiTrinh,
  canDeleteGiaiTrinh,
  onView,
  onDelete,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedGiaiTrinhId, setSelectedGiaiTrinhId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedGiaiTrinhId(id);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedGiaiTrinhId) {
      onDelete(selectedGiaiTrinhId);
      setAlertOpen(false);
      setSelectedGiaiTrinhId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        {loading ? (
          // Hiển thị Skeleton khi đang tải
          <div className="p-4 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filteredGiaiTrinhList.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">Không tìm thấy giải trình nào cho kế hoạch này.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="uppercase text-xs tracking-wide">
                <TableHead
                  className="w-[150px] cursor-pointer font-medium"
                  onClick={toggleSortOrder}
                >
                  Kế hoạch {sortOrder === 'asc' ? '↑' : '↓'}
                </TableHead>
                <TableHead className="font-medium">Người Yêu Cầu</TableHead>
                <TableHead className="font-medium">Người Giải Trình</TableHead>
                <TableHead className="font-medium">Ngày Tạo</TableHead>
                <TableHead className="font-medium">Trạng Thái</TableHead>
                <TableHead className="text-right font-medium">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGiaiTrinhList.map((giaiTrinh) => (
                <TableRow key={giaiTrinh.id}>
                  <TableCell className="font-medium">{giaiTrinh.keHoach.tenKeHoach}</TableCell>
                  <TableCell>{giaiTrinh.nguoiYeuCau.hoTen}</TableCell>
                  <TableCell>{giaiTrinh.nguoiGiaiTrinh.hoTen}</TableCell>
                  <TableCell>{format(new Date(giaiTrinh.ngayTao), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <Badge variant={trangThaiColors[giaiTrinh.trangThaiTongThe] || 'outline'}>
                      {giaiTrinh.trangThaiTongThe}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(giaiTrinh)}>
                          <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        {canEditGiaiTrinh && (
                          <DropdownMenuItem onClick={() => onView(giaiTrinh)}>
                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                        )}
                        {canDeleteGiaiTrinh && (
                          <DropdownMenuItem onClick={() => handleDeleteClick(giaiTrinh.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        )}
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Xác nhận xóa Giải Trình
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa giải trình này? Hành động này không thể hoàn tác và các tệp đính kèm sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
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