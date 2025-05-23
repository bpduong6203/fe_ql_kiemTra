import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import LoadingSpinner from '@/components/loading-spinner';
import type { NguoiDung, Roles, DonVi } from '@/types/interfaces';

interface UserTableProps {
  filteredUserList: NguoiDung[];
  loading: boolean;
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
  canEdit: boolean;
  canHardDelete: boolean;
  rolesList: Roles[];
  donViList: DonVi[];
  onView: (user: NguoiDung) => void;
  onEdit: (user: NguoiDung) => void;
  onDelete: (id: string, isHardDelete: boolean) => void;
  onRoleChange: (userId: string, roleID: string) => Promise<void>;
  onDonViChange: (userId: string, donViID: string) => Promise<void>;
}

export const UserTable: React.FC<UserTableProps> = ({
  filteredUserList,
  loading,
  sortOrder,
  toggleSortOrder,
  canEdit,
  rolesList,
  donViList,
  onView,
  onEdit,
  onDelete,
  onRoleChange,
  onDonViChange,
}) => {
  // Trạng thái loading chung cho hành động thay đổi vai trò hoặc đơn vị
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isHardDelete, setIsHardDelete] = useState<boolean>(false);

  // Hàm xử lý thay đổi vai trò với loading
  const handleRoleChange = async (userId: string, roleID: string) => {
    setIsLoading(true);
    try {
      await onRoleChange(userId, roleID);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý thay đổi đơn vị với loading
  const handleDonViChange = async (userId: string, donViID: string) => {
    setIsLoading(true);
    try {
      await onDonViChange(userId, donViID);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string, hardDelete: boolean) => {
    setSelectedUserId(id);
    setIsHardDelete(hardDelete);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId) {
      onDelete(selectedUserId, isHardDelete);
      setAlertOpen(false);
      setSelectedUserId(null);
      setIsHardDelete(false);
    }
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
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <LoadingSpinner variant={1} />
        </div>
      )}

      <div className="overflow-x-auto rounded-sm">
        <table className="min-w-full border rounded-2xl shadow">
          <thead>
            <tr className="uppercase text-xs tracking-wide">
              <th
                className="px-4 py-3 text-left cursor-pointer font-medium transition-colors"
                onClick={toggleSortOrder}
              >
                Username {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th className="px-4 py-3 text-left font-medium">Họ tên</th>
              <th className="px-4 py-3 text-left font-medium">Vai trò</th>
              <th className="px-4 py-3 text-left font-medium">Đơn vị</th>
              <th className="px-4 py-3 text-left font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUserList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-sm text-muted-foreground">
                  Không tìm thấy người dùng.
                </td>
              </tr>
            ) : (
              filteredUserList.map((user) => (
                <tr key={user.id} className="border-t hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.hoTen || 'N/A'}</td>
                  <td className="px-4 py-2">
                    {canEdit ? (
                      <Select
                        value={user.roleID}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                        disabled={isLoading} 
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesList.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.ten}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      user.role?.ten || 'N/A'
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {canEdit ? (
                      <Select
                        value={user.donViID}
                        onValueChange={(value) => handleDonViChange(user.id, value)}
                        disabled={isLoading} 
                      >
                        <SelectTrigger className="w-[150px]">
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
                    ) : (
                      user.donVi?.tenDonVi || 'N/A'
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => onView(user)} variant="outline" size="icon">
                          <Eye className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xem người dùng</TooltipContent>
                    </Tooltip>
                    {canEdit && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => onEdit(user)} variant="outline" size="icon">
                            <Edit className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sửa người dùng</TooltipContent>
                      </Tooltip>
                    )}
                    {canEdit && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleDeleteClick(user.id, false)}
                            variant="destructive"
                            size="icon"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Xóa người dùng</TooltipContent>
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
              Bạn có chắc chắn muốn xóa người dùng này? Tài khoản sẽ được chuyển vào thùng rác và có thể khôi phục sau.
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