import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  canHardDelete,
  rolesList,
  donViList,
  onView,
  onEdit,
  onDelete,
  onRoleChange,
  onDonViChange,
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
                    <Select value={user.roleID} onValueChange={(value) => onRoleChange(user.id, value)}>
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
                    <Select value={user.donViID} onValueChange={(value) => onDonViChange(user.id, value)}>
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
                          onClick={() => onDelete(user.id, false)}
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xóa mềm người dùng</TooltipContent>
                    </Tooltip>
                  )}
                  {canHardDelete && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onDelete(user.id, true)}
                          variant="destructive"
                          size="icon"
                          className="bg-red-700 hover:bg-red-800"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xóa vĩnh viễn người dùng</TooltipContent>
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