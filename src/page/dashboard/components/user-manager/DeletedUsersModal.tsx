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
import type { NguoiDung } from '@/types/interfaces';

interface DeletedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedUsers: NguoiDung[];
  onPermanentDelete: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
}

export const DeletedUsersModal: React.FC<DeletedUsersModalProps> = ({
  isOpen,
  onClose,
  deletedUsers,
  onPermanentDelete,
  onRestore,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'restore' | null>(null);

  const handleActionClick = (id: string, action: 'delete' | 'restore') => {
    setSelectedUserId(id);
    setActionType(action);
    setAlertOpen(true);
  };

  const confirmAction = async () => {
    if (selectedUserId && actionType) {
      if (actionType === 'delete') {
        await onPermanentDelete(selectedUserId);
      } else if (actionType === 'restore') {
        await onRestore(selectedUserId);
      }
      setAlertOpen(false);
      setSelectedUserId(null);
      setActionType(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Thùng rác - Tài khoản đã xóa
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-x-auto">
            {deletedUsers.length === 0 ? (
              <p>Không có tài khoản nào trong thùng rác.</p>
            ) : (
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <th className="border p-2 text-left">Tên đăng nhập</th>
                    <th className="border p-2 text-left">Họ tên</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="border p-2">{user.username}</td>
                      <td className="border p-2">{user.hoTen || 'N/A'}</td>
                      <td className="border p-2">{user.email || 'N/A'}</td>
                      <td className="border p-2 flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleActionClick(user.id, 'restore')}
                              variant="outline"
                              size="icon"
                            >
                              <RotateCcw className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Khôi phục tài khoản</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleActionClick(user.id, 'delete')}
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
                ? 'Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này? Hành động này không thể hoàn tác.'
                : 'Bạn có chắc chắn muốn khôi phục tài khoản này? Tài khoản sẽ trở lại danh sách người dùng.'}
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