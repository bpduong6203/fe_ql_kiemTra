import { useState, useEffect, useCallback } from 'react';
import { getKeHoachs, getDeletedKeHoachs, createKeHoach, updateKeHoach, softDeleteKeHoach, hardDeleteKeHoach, restoreKeHoach } from '@/lib/apiKeHoach';
import { getDonVis } from '@/lib/apidonvi';
import { getUserInfo } from '@/lib/api';
import type { KeHoach, DonVi } from '@/types/interfaces';
import { useToast } from '@/components/toast-provider';

interface FileWithType {
  file: File;
  loaiTaiLieu: number;
}

export const useKeHoach = () => {
  const [keHoachList, setKeHoachList] = useState<KeHoach[]>([]);
  const [filteredKeHoachList, setFilteredKeHoachList] = useState<KeHoach[]>([]);
  const [deletedKeHoachList, setDeletedKeHoachList] = useState<KeHoach[]>([]);
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const { addToast } = useToast();

  // Lấy thông tin user để kiểm tra role
  const fetchUserInfo = useCallback(async () => {
    console.log('fetchUserInfo called');
    try {
      const userInfo = await getUserInfo();
      setUserRole(userInfo.role);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, []);

  // Lấy danh sách kế hoạch và đơn vị
  const fetchKeHoachs = useCallback(async () => {
    console.log('fetchKeHoachs called');
    try {
      setLoading(true);
      const [keHoachs, donVis] = await Promise.all([getKeHoachs(), getDonVis()]);
      const sortedKeHoachs = keHoachs.sort((a: KeHoach, b: KeHoach) =>
        sortOrder === 'asc'
          ? a.tenKeHoach.localeCompare(b.tenKeHoach)
          : b.tenKeHoach.localeCompare(a.tenKeHoach)
      );
      setKeHoachList(sortedKeHoachs);
      setFilteredKeHoachList(sortedKeHoachs);
      setDonViList(donVis);
    } catch (error) {
      console.error('Error fetching kế hoạch:', error);
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  // Lấy danh sách kế hoạch bị xóa mềm
  const fetchDeletedKeHoachs = useCallback(async () => {
    console.log('fetchDeletedKeHoachs called');
    try {
      const deletedKeHoachs = await getDeletedKeHoachs();
      console.log('getDeletedKeHoachs response:', deletedKeHoachs);
      setDeletedKeHoachList(deletedKeHoachs);
    } catch (error) {
      console.error('Error fetching deleted kế hoạch:', error);
    }
  }, []);

  // Tự động load dữ liệu khi hook khởi tạo
  useEffect(() => {
    fetchUserInfo();
    fetchKeHoachs();
  }, [fetchUserInfo, fetchKeHoachs]);

  // Lọc kế hoạch theo tìm kiếm
  useEffect(() => {
    const filtered = keHoachList.filter((keHoach) =>
      keHoach.tenKeHoach.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredKeHoachList(filtered);
  }, [searchQuery, keHoachList]);

  // Sắp xếp
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setFilteredKeHoachList([...filteredKeHoachList].sort((a, b) =>
      newSortOrder === 'asc'
        ? a.tenKeHoach.localeCompare(b.tenKeHoach)
        : b.tenKeHoach.localeCompare(a.tenKeHoach)
    ));
  };

  // Lưu kế hoạch (tạo/sửa)
  const handleSave = async (data: Partial<KeHoach> & { files?: FileWithType[] }, mode: 'create' | 'edit', id?: string): Promise<KeHoach> => {
    try {
      const payload = {
        ...data,
        files: data.files?.map((item) => ({
          file: item.file,
          loaiTaiLieu: item.loaiTaiLieu,
        })),
      };
      let result: KeHoach;
      if (mode === 'create') {
        result = await createKeHoach(payload);
        addToast('Thêm đơn vị thành công!', 'success');
      } else {
        result = await updateKeHoach(id!, payload);
        addToast('Cập nhật đơn vị thành công!', 'success');
      }
      fetchKeHoachs();
      return result;
    } catch (error) {
      console.error('Error saving kế hoạch:', error);
      throw error;
    }
  };

  // Xóa kế hoạch
  const handleDelete = async (id: string, isHardDelete: boolean = false) => {
    try {
      if (isHardDelete) {
        await hardDeleteKeHoach(id);
      } else {
        await softDeleteKeHoach(id);
      }
      fetchKeHoachs();
      fetchDeletedKeHoachs();
    } catch (error) {
      console.error('Error deleting kế hoạch:', error);
    }
  };

  // Xóa vĩnh viễn kế hoạch
  const handlePermanentDelete = async (id: string) => {
    try {
      await hardDeleteKeHoach(id);
      fetchDeletedKeHoachs();
      addToast('Xóa thành công!', 'success');
    } catch (error) {
      console.error('Error permanently deleting kế hoạch:', error);
    }
  };

  // Khôi phục kế hoạch
  const handleRestore = async (id: string) => {
    try {
      await restoreKeHoach(id);
      fetchDeletedKeHoachs();
      fetchKeHoachs();
      addToast('Khôi phục thành công!', 'success');
    } catch (error) {
      console.error('Error restoring kế hoạch:', error);
    }
  };

  // Phân quyền
  const canEdit = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canHardDelete = userRole === 'TruongDoan';

  return {
    keHoachList,
    filteredKeHoachList,
    deletedKeHoachList,
    donViList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    userRole,
    fetchUserInfo,
    fetchKeHoachs,
    fetchDeletedKeHoachs,
    toggleSortOrder,
    handleSave,
    handleDelete,
    handlePermanentDelete,
    handleRestore,
    canEdit,
    canHardDelete,
  };
};