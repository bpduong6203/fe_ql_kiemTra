import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import GenericModal from '@/components/generic-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Field, DonVi, NguoiDung, Roles } from '@/types/interfaces';

export default function UserManager() {
  const [userList, setUserList] = useState<NguoiDung[]>([]);
  const [filteredUserList, setFilteredUserList] = useState<NguoiDung[]>([]);
  const [rolesList, setRolesList] = useState<Roles[]>([]);
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('create');
  const [selectedUser, setSelectedUser] = useState<NguoiDung | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data for users, roles, and units
      const mockUsers: NguoiDung[] = [
        {
          id: '1',
          username: 'user1',
          hoTen: 'Nguyễn Văn A',
          email: 'user1@example.com',
          soDienThoai: '0123456789',
          diaChi: '123 Đường A, Hà Nội',
          roleID: '1',
          donViID: '1',
        },
        {
          id: '2',
          username: 'user2',
          hoTen: 'Trần Thị B',
          email: 'user2@example.com',
          soDienThoai: '0987654321',
          diaChi: '456 Đường B, TP.HCM',
          roleID: '2',
          donViID: '2',
        },
      ];
      const mockRoles: Roles[] = [
        { id: '1', ten: 'Admin', moTa: 'Quản trị viên' },
        { id: '2', ten: 'User', moTa: 'Người dùng thường' },
      ];
      const mockDonVi: DonVi[] = [
        { id: '1', tenDonVi: 'Đơn vị A' },
        { id: '2', tenDonVi: 'Đơn vị B' },
      ];
      setUserList(mockUsers);
      setFilteredUserList(mockUsers);
      setRolesList(mockRoles);
      setDonViList(mockDonVi);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter users by search query
  useEffect(() => {
    const filtered = userList.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.hoTen?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUserList(filtered);
  }, [searchQuery, userList]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (user: NguoiDung) => {
    setSelectedUser(user);
    setModalMode('edit');
    setModalOpen(true);
  };

  const openViewModal = (user: NguoiDung) => {
    setSelectedUser(user);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      // Validate password and confirmPassword
      if (data.password !== data.confirmPassword) {
        throw new Error('Mật khẩu và xác nhận mật khẩu không khớp');
      }
      // Exclude confirmPassword from payload
      const { confirmPassword, ...payload } = data;
      await apiFetch(selectedUser ? `/users/${selectedUser.id}` : '/users', {
        method: selectedUser ? 'PUT' : 'POST',
        data: payload,
      });
      fetchData();
      setModalOpen(false);
      toast.success(`Đã ${selectedUser ? 'cập nhật' : 'tạo'} người dùng thành công`);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error instanceof Error ? error.message : 'Lỗi khi lưu người dùng');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    try {
      await apiFetch(`/users/${id}`, { method: 'DELETE' });
      fetchData();
      toast.success('Đã xóa người dùng thành công');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Lỗi khi xóa người dùng');
    }
  };

  const handleRoleChange = async (userId: string, roleID: string) => {
    try {
      await apiFetch(`/users/${userId}`, {
        method: 'PATCH',
        data: { roleID },
      });
      fetchData();
      toast.success('Cập nhật vai trò thành công');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Lỗi khi cập nhật vai trò');
    }
  };

  const handleDonViChange = async (userId: string, donViID: string) => {
    try {
      await apiFetch(`/users/${userId}`, {
        method: 'PATCH',
        data: { donViID },
      });
      fetchData();
      toast.success('Cập nhật đơn vị thành công');
    } catch (error) {
      console.error('Error updating don vi:', error);
      toast.error('Lỗi khi cập nhật đơn vị');
    }
  };

  const userFields: Field[] = [
    { name: 'username', label: 'Tên đăng nhập', type: 'text', required: true },
    { name: 'password', label: 'Mật khẩu', type: 'password', required: modalMode === 'create', inline: true },
    { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', required: modalMode === 'create' , inline: true},
    { name: 'hoTen', label: 'Họ tên', type: 'text' },
    { name: 'email', label: 'Email', type: 'email', inline: true },
    { name: 'soDienThoai', label: 'Số điện thoại', type: 'text', inline: true },
    { name: 'diaChi', label: 'Địa chỉ', type: 'text' },
    {
      name: 'roleID',
      label: 'Vai trò',
      type: 'select',
      options: rolesList.map((role) => ({ value: role.id, label: role.ten })),
      required: true,
      inline: true,
    },
    {
      name: 'donViID',
      label: 'Đơn vị',
      type: 'select',
      options: donViList.map((donVi) => ({ value: donVi.id, label: donVi.tenDonVi })),
      required: true,
      inline: true,
    },
  ];

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Danh sách người dùng
          <Button onClick={openCreateModal} variant="secondary">
            Tạo mới
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Search bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-sm">
            <table className="min-w-full border rounded-2xl shadow">
              <thead>
                <tr className="uppercase text-xs tracking-wide">
                  <th className="px-4 py-3 text-left font-medium">Username</th>
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
                        <Select
                          value={user.roleID}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
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
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={user.donViID}
                          onValueChange={(value) => handleDonViChange(user.id, value)}
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
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button
                          onClick={() => openViewModal(user)}
                          variant="outline"
                          size="icon"
                          title="Xem người dùng"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          onClick={() => openEditModal(user)}
                          variant="outline"
                          size="icon"
                          title="Sửa người dùng"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.id)}
                          variant="destructive"
                          size="icon"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <GenericModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            modalMode === 'view' ? 'Xem người dùng' :
            modalMode === 'edit' ? 'Sửa người dùng' : 'Tạo người dùng mới'
          }
          initialData={selectedUser || {}}
          fields={userFields.map(field => ({
            ...field,
            disabled: modalMode === 'view'
          }))}
          apiEndpoint={selectedUser ? `/users/${selectedUser.id}` : '/users'}
          method={selectedUser ? 'PUT' : 'POST'}
          onSave={modalMode === 'view' ? async () => {} : handleSave}
        />
      </CardContent>
    </Card>
  );
}