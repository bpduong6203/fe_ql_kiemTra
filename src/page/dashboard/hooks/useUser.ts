import { useState, useEffect, useCallback } from 'react';
import { restoreUser, getDeletedUsers, getAllUsers, createUser, updateUser, updateUserRole, updateUserDonVi, softDeleteUser, hardDeleteUser } from '@/lib/apiuser';
import type { NguoiDung, Roles, DonVi } from '@/types/interfaces';
import { getAllRoles, getUserInfo } from '@/lib/api';
import { getDonVis } from '@/lib/apidonvi';
import { useToast } from '@/components/toast-provider';

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
  const { addToast } = useToast();

  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = await getUserInfo();
      setUserRole(userInfo.role);
    } catch (error) {
    }
  }, []);

  const fetchUsers = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await hardDeleteUser(id);
      await fetchDeletedUsers();
    } catch (error) {
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
        addToast('Thêm người dùng thành công!', 'success');
      } else {
        await updateUser(id!, payload);
        addToast('Cập nhật thông tin người dùng thành công', 'success');
      }
      fetchUsers();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id: string, isHardDelete: boolean = false) => {
    try {
      if (isHardDelete) {
        await hardDeleteUser(id);
        addToast('Xóa nguòi dùng thành công!', 'success');
      } else {
        await softDeleteUser(id);
        addToast('Xóa người dùng thành công!', 'success');
      }
      fetchUsers();
    } catch (error) {
    }
  };

  const handleRoleChange = async (userId: string, roleID: string) => {
    try {
      await updateUserRole(userId, roleID);
      fetchUsers();
      addToast('Cập nhật vai trò thành công!', 'success');
    } catch (error) {
    }
  };

  const handleDonViChange = async (userId: string, donViID: string) => {
    try {
      await updateUserDonVi(userId, donViID);
      fetchUsers();
      addToast('Cập nhật đơn vị thành công', 'success');
    } catch (error) {
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

    const handleRestore = async (id: string) => {
    try {
      await restoreUser(id);
      await fetchDeletedUsers();
      await fetchUsers();
      addToast('Khôi phục thành công!', 'success');
    } catch (error) {
    }
  };

  const canEdit = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canHardDelete = userRole === 'TruongDoan';

  return {
    handleRestore,
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