import { useState, useEffect, useCallback } from 'react';
import { getDonVis, createDonVi, updateDonVi, softDeleteDonVi, hardDeleteDonVi, getDeletedDonVis, restoreDonVi } from '@/lib/apidonvi';
import type { DonVi } from '@/types/interfaces';
import { getUserInfo } from '@/lib/api';
import { useToast } from '@/components/toast-provider';

export const useDonVi = () => {
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [filteredDonViList, setFilteredDonViList] = useState<DonVi[]>([]);
  const [deletedDonViList, setDeletedDonViList] = useState<DonVi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);

  const { addToast } = useToast();

  // Lấy thông tin user để kiểm tra role
  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = await getUserInfo();
      setUserRole(userInfo.role);
    } catch (error) {
    }
  }, [addToast]);


  // Lấy danh sách đơn vị
  const fetchDonVi = useCallback(async () => {
    try {
      setLoading(true);
      const donVis = await getDonVis();
      const sortedDonVi = donVis.sort((a: DonVi, b: DonVi) =>
        sortOrder === 'asc' ? a.tenDonVi.localeCompare(b.tenDonVi) : b.tenDonVi.localeCompare(b.tenDonVi)
      );
      setDonViList(sortedDonVi);
      setFilteredDonViList(sortedDonVi);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [sortOrder, addToast]);

  // Lấy danh sách đơn vị bị xóa mềm
  const fetchDeletedDonVis = useCallback(async () => {
    try {
      const deletedDonVis = await getDeletedDonVis();
      setDeletedDonViList(deletedDonVis);
    } catch (error) {
    }
  }, [addToast]);

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
        addToast('Tạo đơn vị thành công', 'success');
      } else {
        await updateDonVi(id!, payload);
        addToast('Cập nhật đơn vị thành công', 'success');
      }
      fetchDonVi();
    } catch (error) {
      addToast(`Lỗi khi ${mode === 'create' ? 'tạo' : 'cập nhật'} đơn vị`, 'error');
      throw error;
    }
  };

  // Xóa đơn vị
  const handleDelete = async (id: string, isHardDelete: boolean = false) => {
    try {
      if (isHardDelete) {
        if (!canHardDelete) {
          addToast('Bạn không có quyền xóa vĩnh viễn đơn vị', 'error');
          throw new Error('Insufficient permissions');
        }
        await hardDeleteDonVi(id);
        addToast('Xóa vĩnh viễn đơn vị thành công', 'success');
      } else {
        await softDeleteDonVi(id);
        addToast('Xóa mềm đơn vị thành công', 'success');
      }
      fetchDonVi();
      fetchDeletedDonVis();
    } catch (error) {
      addToast(`Lỗi khi ${isHardDelete ? 'xóa vĩnh viễn' : 'xóa mềm'} đơn vị`, 'error');
    }
  };

  // Xóa vĩnh viễn đơn vị
  const handlePermanentDelete = async (id: string) => {
    try {
      if (!canHardDelete) {
        addToast('Bạn không có quyền xóa vĩnh viễn đơn vị', 'error');
        throw new Error('Insufficient permissions');
      }
      await hardDeleteDonVi(id);
      addToast('Xóa vĩnh viễn đơn vị thành công', 'success');
      fetchDeletedDonVis();
    } catch (error) {
      addToast('Lỗi khi xóa vĩnh viễn đơn vị', 'error');
    }
  };

  // Khôi phục đơn vị
  const handleRestore = async (id: string) => {
    try {
      await restoreDonVi(id);
      addToast('Khôi phục đơn vị thành công', 'success');
      fetchDeletedDonVis();
      fetchDonVi();
    } catch (error) {
      addToast('Lỗi khi khôi phục đơn vị', 'error');
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