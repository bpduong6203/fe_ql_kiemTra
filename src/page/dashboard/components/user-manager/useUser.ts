import { useState, useEffect, useCallback } from 'react';
import { getDeletedUsers, getAllUsers, createUser, updateUser, updateUserRole, updateUserDonVi, softDeleteUser, hardDeleteUser, getAllRoles, getDonVis, getUserInfo } from '@/lib/api';
import { toast } from 'react-toastify';
import type { NguoiDung, Roles, DonVi } from '@/types/interfaces';

export const useUser = () => {
  const [userList, setUserList] = useState<NguoiDung[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<NguoiDung[]>([]);
  const [filteredUserList, setFilteredUserList] = useState<NguoiDung[]>([]);
  const [rolesList, setRolesList] = useState<Roles[]>([]);
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    console.log('fetchUserInfo called');
    try {
      const userInfo = await getUserInfo();
      setUserRole(userInfo.role);
      console.log('Role from API:', userInfo.role);
    } catch (error) {
      console.error('Error fetching user info:', error);
      toast.error('Lỗi khi lấy thông tin người dùng');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    console.log('fetchUsers called');
    try {
      setLoading(true);
      const [users, roles, donVis] = await Promise.all([
        getAllUsers(),
        getAllRoles(),
        getDonVis(),
      ]);
      const sortedUsers = users.sort((a: NguoiDung, b: NguoiDung) =>
        sortOrder === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username)
      );
      setUserList(sortedUsers);
      setFilteredUserList(sortedUsers);
      setRolesList(roles);
      setDonViList(donVis);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Lỗi khi tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  const fetchDeletedUsers = async () => {
    try {
      setLoading(true);
      const deleted = await getDeletedUsers();
      setDeletedUsers(deleted);
    } catch (error) {
      console.error('Error fetching deleted users:', error);
      toast.error('Lỗi khi tải danh sách tài khoản đã xóa');
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await hardDeleteUser(id);
      toast.success('Xóa vĩnh viễn tài khoản thành công');
      await fetchDeletedUsers();
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      toast.error('Lỗi khi xóa vĩnh viễn tài khoản');
    }
  };

  const handleSave = async (data: any, mode: 'create' | 'edit', id?: string) => {
    try {
      if (mode === 'create' || (data.password && data.password.trim())) {
        if (!data.password && mode === 'create') {
          throw new Error('Vui lòng nhập mật khẩu');
        }
        if (data.password !== data.confirmPassword) {
          throw new Error('Mật khẩu và xác nhận mật khẩu không khớp');
        }
      }

      const { confirmPassword, ...payload } = data;
      if (mode === 'create') {
        await createUser(payload);
        toast.success('Tạo người dùng thành công');
      } else {
        await updateUser(id!, payload);
        toast.success('Cập nhật người dùng thành công');
      }
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error instanceof Error ? error.message : 'Lỗi khi lưu người dùng');
      throw error;
    }
  };

  const handleDelete = async (id: string, isHardDelete: boolean = false) => {
    try {
      if (isHardDelete) {
        await hardDeleteUser(id);
        toast.success('Xóa vĩnh viễn người dùng thành công');
      } else {
        await softDeleteUser(id);
        toast.success('Xóa mềm người dùng thành công');
      }
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Lỗi khi ${isHardDelete ? 'xóa vĩnh viễn' : 'xóa mềm'} người dùng`);
    }
  };

  const handleRoleChange = async (userId: string, roleID: string) => {
    try {
      await updateUserRole(userId, roleID);
      toast.success('Cập nhật vai trò thành công');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Lỗi khi cập nhật vai trò');
    }
  };

  const handleDonViChange = async (userId: string, donViID: string) => {
    try {
      await updateUserDonVi(userId, donViID);
      toast.success('Cập nhật đơn vị thành công');
      fetchUsers();
    } catch (error) {
      console.error('Error updating don vi:', error);
      toast.error('Lỗi khi cập nhật đơn vị');
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchUsers();
  }, [fetchUserInfo, fetchUsers]);

  useEffect(() => {
    const filtered = userList.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.hoTen?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUserList(filtered);
  }, [searchQuery, userList]);

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setFilteredUserList([...filteredUserList].sort((a, b) =>
      newSortOrder === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username)
    ));
  };

  const canEdit = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canHardDelete = userRole === 'TruongDoan';

  return {
    handlePermanentDelete,
    deletedUsers,
    fetchDeletedUsers,
    userList,
    filteredUserList,
    rolesList,
    donViList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    userRole,
    fetchUserInfo,
    fetchUsers,
    toggleSortOrder,
    handleSave,
    handleDelete,
    handleRoleChange,
    handleDonViChange,
    canEdit,
    canHardDelete,
  };
};