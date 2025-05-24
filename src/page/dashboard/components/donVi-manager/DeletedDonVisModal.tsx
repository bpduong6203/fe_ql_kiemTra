import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Trash2, RotateCcw } from 'lucide-react';
import type { DonVi } from '@/types/interfaces';

interface DeletedDonVisModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedDonVis: DonVi[];
  onPermanentDelete: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
}

export const DeletedDonVisModal: React.FC<DeletedDonVisModalProps> = ({
  isOpen,
  onClose,
  deletedDonVis,
  onPermanentDelete,
  onRestore,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedDonViId, setSelectedDonViId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'restore' | null>(null);

  const handleActionClick = (id: string, action: 'delete' | 'restore') => {
    setSelectedDonViId(id);
    setActionType(action);
    setAlertOpen(true);
  };

  const confirmAction = async () => {
    if (selectedDonViId && actionType) {
      if (actionType === 'delete') {
        await onPermanentDelete(selectedDonViId);
      } else if (actionType === 'restore') {
        await onRestore(selectedDonViId);
      }
      setAlertOpen(false);
      setSelectedDonViId(null);
      setActionType(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Thùng rác - Đơn vị đã xóa
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-x-auto">
            {deletedDonVis.length === 0 ? (
              <p>Không có đơn vị nào trong thùng rác.</p>
            ) : (
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <th className="border p-2 text-left">Tên đơn vị</th>
                    <th className="border p-2 text-left">Địa chỉ</th>
                    <th className="border p-2 text-left">Số điện thoại</th>
                    <th className="border p-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedDonVis.map((donVi) => (
                    <tr key={donVi.id}>
                      <td className="border p-2">{donVi.tenDonVi}</td>
                      <td className="border p-2">{donVi.diaChi || 'N/A'}</td>
                      <td className="border p-2">{donVi.soDienThoai || 'N/A'}</td>
                      <td className="border p-2 flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleActionClick(donVi.id, 'restore')}
                              variant="outline"
                              size="icon"
                            >
                              <RotateCcw className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Khôi phục đơn vị</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleActionClick(donVi.id, 'delete')}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Xóa vĩnh viễn</TooltipContent>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'delete' ? 'Xác nhận xóa vĩnh viễn' : 'Xác nhận khôi phục'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'delete'
                ? 'Bạn có chắc chắn muốn xóa vĩnh viễn đơn vị này? Hành động này không thể hoàn tác.'
                : 'Bạn có chắc chắn muốn khôi phục đơn vị này? Đơn vị sẽ trở lại danh sách đơn vị.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                actionType === 'delete'
                  ? 'bg-destructive text-white hover:bg-destructive/90'
                  : 'bg-primary hover:bg-primary/90'
              }
            >
              {actionType === 'delete' ? 'Xóa vĩnh viễn' : 'Khôi phục'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};