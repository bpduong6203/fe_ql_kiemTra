import { useState, useEffect, useCallback } from 'react';
import { getDonVis, createDonVi, updateDonVi, softDeleteDonVi, hardDeleteDonVi, getDeletedDonVis, restoreDonVi } from '@/lib/apidonvi';
import { toast } from 'react-toastify';
import type { DonVi } from '@/types/interfaces';
import { getUserInfo } from '@/lib/api';

export const useDonVi = () => {
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [filteredDonViList, setFilteredDonViList] = useState<DonVi[]>([]);
  const [deletedDonViList, setDeletedDonViList] = useState<DonVi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);

  // Lấy thông tin user để kiểm tra role
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

  // Lấy danh sách đơn vị
  const fetchDonVi = useCallback(async () => {
    console.log('fetchDonVi called');
    try {
      setLoading(true);
      const donVis = await getDonVis();
      console.log('getDonVis response:', donVis);
      const sortedDonVi = donVis.sort((a: DonVi, b: DonVi) =>
        sortOrder === 'asc' ? a.tenDonVi.localeCompare(b.tenDonVi) : b.tenDonVi.localeCompare(b.tenDonVi)
      );
      setDonViList(sortedDonVi);
      setFilteredDonViList(sortedDonVi);
    } catch (error) {
      console.error('Error fetching don vi:', error);
      toast.error('Lỗi khi tải dữ liệu đơn vị');
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  // Lấy danh sách đơn vị bị xóa mềm
  const fetchDeletedDonVis = useCallback(async () => {
    console.log('fetchDeletedDonVis called');
    try {
      const deletedDonVis = await getDeletedDonVis();
      console.log('getDeletedDonVis response:', deletedDonVis);
      setDeletedDonViList(deletedDonVis);
    } catch (error) {
      console.error('Error fetching deleted don vi:', error);
      toast.error('Lỗi khi tải đơn vị đã xóa');
    }
  }, []);

  // Tự động load dữ liệu khi hook khởi tạo
  useEffect(() => {
    fetchUserInfo();
    fetchDonVi();
  }, [fetchUserInfo, fetchDonVi]);

  // Lọc đơn vị theo tìm kiếm
  useEffect(() => {
    const filtered = donViList.filter((donVi) =>
      donVi.tenDonVi.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDonViList(filtered);
  }, [searchQuery, donViList]);

  // Sắp xếp
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setFilteredDonViList([...filteredDonViList].sort((a, b) =>
      newSortOrder === 'asc' ? a.tenDonVi.localeCompare(b.tenDonVi) : b.tenDonVi.localeCompare(b.tenDonVi)
    ));
  };

  // Lưu đơn vị (tạo/sửa)
  const handleSave = async (data: any, mode: 'create' | 'edit', id?: string) => {
    try {
      const payload = { ...data };
      if (mode === 'create') {
        await createDonVi(payload);
        toast.success('Tạo đơn vị thành công');
      } else {
        await updateDonVi(id!, payload);
        toast.success('Cập nhật đơn vị thành công');
      }
      fetchDonVi();
    } catch (error) {
      console.error('Error saving don vi:', error);
      toast.error('Lỗi khi lưu đơn vị');
      throw error;
    }
  };

  // Xóa đơn vị
  const handleDelete = async (id: string, isHardDelete: boolean = false) => {
    try {
      if (isHardDelete) {
        await hardDeleteDonVi(id);
        toast.success('Xóa vĩnh viễn đơn vị thành công');
      } else {
        await softDeleteDonVi(id);
        toast.success('Xóa mềm đơn vị thành công');
      }
      fetchDonVi();
      fetchDeletedDonVis();
    } catch (error) {
      console.error('Error deleting don vi:', error);
      toast.error(`Lỗi khi ${isHardDelete ? 'xóa vĩnh viễn' : 'xóa mềm'} đơn vị`);
    }
  };

  // Xóa vĩnh viễn đơn vị
  const handlePermanentDelete = async (id: string) => {
    try {
      await hardDeleteDonVi(id);
      toast.success('Xóa vĩnh viễn đơn vị thành công');
      fetchDeletedDonVis();
    } catch (error) {
      console.error('Error permanently deleting don vi:', error);
      toast.error('Lỗi khi xóa vĩnh viễn đơn vị');
    }
  };

  // Khôi phục đơn vị
  const handleRestore = async (id: string) => {
    try {
      await restoreDonVi(id);
      toast.success('Khôi phục đơn vị thành công');
      fetchDeletedDonVis();
      fetchDonVi();
    } catch (error) {
      console.error('Error restoring don vi:', error);
      toast.error('Lỗi khi khôi phục đơn vị');
    }
  };

  // Phân quyền
  const canEdit = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canHardDelete = userRole === 'TruongDoan';

  return {
    donViList,
    filteredDonViList,
    deletedDonViList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    userRole,
    fetchUserInfo,
    fetchDonVi,
    fetchDeletedDonVis,
    toggleSortOrder,
    handleSave,
    handleDelete,
    handlePermanentDelete,
    handleRestore,
    canEdit,
    canHardDelete,
  };
};
