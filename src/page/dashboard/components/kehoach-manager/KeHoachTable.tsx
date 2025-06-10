import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PencilIcon, Trash2, RotateCcw, XCircle } from 'lucide-react';
import type { KeHoachTableProps } from '@/types/interfaces';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const KeHoachTable: React.FC<KeHoachTableProps> = ({
  keHoachs,
  activeTab,
  canEdit,
  canHardDelete,
  handleEdit,
  onConfirmDelete,
  onConfirmRestore,
  onConfirmPermanentDelete,
}) => {
  if (keHoachs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Không có kế hoạch nào.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên kế hoạch</TableHead>
            <TableHead>Đơn vị</TableHead>
            <TableHead>Ngày bắt đầu</TableHead>
            <TableHead>Ngày kết thúc</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keHoachs.map((keHoach) => (
            <TableRow key={keHoach.id}>
              <TableCell className="font-medium">{keHoach.tenKeHoach}</TableCell>
              <TableCell>{keHoach.donVi?.tenDonVi || 'N/A'}</TableCell>
              <TableCell>{format(new Date(keHoach.ngayBatDau), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{format(new Date(keHoach.ngayKetThuc), 'dd/MM/yyyy')}</TableCell>
              <TableCell className="text-right space-x-2">
                {activeTab === 'current' && canEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(keHoach)}>
                        <PencilIcon className="size-4" />
                      </Button>                      
                    </TooltipTrigger>
                    <TooltipContent>Chỉnh sửa</TooltipContent>
                  </Tooltip>
                )}
                {activeTab === 'current' && (canEdit || canHardDelete) && ( // Quyền xóa mềm
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="size-4" />
                        <span className="sr-only">Xóa mềm</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa mềm kế hoạch này?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Kế hoạch này sẽ được đánh dấu là đã xóa và không hiển thị trong danh sách chính, nhưng vẫn có thể khôi phục.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onConfirmDelete(keHoach.id, false)}>Xóa mềm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {activeTab === 'deleted' && canEdit && ( // Quyền khôi phục
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="size-4" />
                        <span className="sr-only">Khôi phục</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn khôi phục kế hoạch này?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Kế hoạch này sẽ được khôi phục và hiển thị lại trong danh sách chính.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onConfirmRestore(keHoach.id)}>Khôi phục</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {activeTab === 'deleted' && canHardDelete && ( // Quyền xóa vĩnh viễn
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <XCircle className="size-4" />
                        <span className="sr-only">Xóa vĩnh viễn</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn XÓA VĨNH VIỄN kế hoạch này?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến kế hoạch này sẽ bị xóa.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onConfirmPermanentDelete(keHoach.id)}>Xóa vĩnh viễn</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default KeHoachTable;