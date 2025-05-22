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
import type { NguoiDung } from '@/types/interfaces';

interface DeletedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedUsers: NguoiDung[];
  onPermanentDelete: (id: string) => Promise<void>;
}

export const DeletedUsersModal: React.FC<DeletedUsersModalProps> = ({
  isOpen,
  onClose,
  deletedUsers,
  onPermanentDelete,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      await onPermanentDelete(selectedUserId);
      setAlertOpen(false);
      setSelectedUserId(null);
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
                  <tr className="bg-gray-100">
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
                      <td className="border p-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          Xóa vĩnh viễn
                        </Button>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vĩnh viễn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};