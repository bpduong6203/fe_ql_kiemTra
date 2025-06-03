import { useState, useEffect, useCallback } from 'react';
import { getTaiLieus, createTaiLieu, deleteTaiLieu } from '@/lib/apiTaiLieu';
import { getKeHoachs } from '@/lib/apiKeHoach';
import { getUserInfo } from '@/lib/api';
import { uploadFile } from '@/lib/api';
import type { TaiLieu, KeHoach } from '@/types/interfaces';
import { useToast } from '@/components/toast-provider';

export const useTaiLieu = () => {
  const [taiLieuList, setTaiLieuList] = useState<TaiLieu[]>([]);
  const [filteredTaiLieuList, setFilteredTaiLieuList] = useState<TaiLieu[]>([]);
  const [keHoachList, setKeHoachList] = useState<KeHoach[]>([]);
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
  }, [addToast]);

  // Lấy danh sách tài liệu và kế hoạch
  const fetchTaiLieus = useCallback(async () => {
    console.log('fetchTaiLieus called');
    try {
      setLoading(true);
      const [taiLieus, keHoachs] = await Promise.all([getTaiLieus(), getKeHoachs()]);
      const sortedTaiLieus = taiLieus.sort((a: TaiLieu, b: TaiLieu) =>
        sortOrder === 'asc'
          ? a.tenFile.localeCompare(b.tenFile)
          : b.tenFile.localeCompare(a.tenFile)
      );
      setTaiLieuList(sortedTaiLieus);
      setFilteredTaiLieuList(sortedTaiLieus);
      setKeHoachList(keHoachs);
    } catch (error) {
      console.error('Error fetching tài liệu:', error);
    } finally {
      setLoading(false);
    }
  }, [sortOrder, addToast]);

  // Tự động load dữ liệu khi hook khởi tạo
  useEffect(() => {
    fetchUserInfo();
    fetchTaiLieus();
  }, [fetchUserInfo, fetchTaiLieus]);

  // Lọc tài liệu theo tìm kiếm
  useEffect(() => {
    const filtered = taiLieuList.filter((taiLieu) =>
      taiLieu.tenFile.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTaiLieuList(filtered);
  }, [searchQuery, taiLieuList]);

  // Sắp xếp
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setFilteredTaiLieuList([...filteredTaiLieuList].sort((a, b) =>
      newSortOrder === 'asc'
        ? a.tenFile.localeCompare(b.tenFile)
        : b.tenFile.localeCompare(a.tenFile)
    ));
    addToast(`Sắp xếp theo thứ tự ${newSortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}`, 'success');
  };

  // Tạo mới tài liệu
  const handleCreate = async (file: File, tenFile: string, keHoachId: string, loaiTaiLieu: number) => {
    try {
      // Upload file để lấy URL
      const uploadResult = await uploadFile(file);
      const fileUrl = uploadResult.url;

      if (!fileUrl) {
        throw new Error(`Không nhận được URL cho file "${tenFile}"`);
      }

      // Gọi createTaiLieu với fileUrl
      await createTaiLieu(tenFile, fileUrl, keHoachId, loaiTaiLieu);
      fetchTaiLieus();
      addToast('Tạo tài liệu thành công', 'success');
    } catch (error) {
      console.error('Error creating tài liệu:', error);
      addToast('Lỗi khi tạo tài liệu', 'error');
      throw error;
    }
  };

  // Xóa tài liệu
  const handleDelete = async (id: string) => {
    try {
      if (!canEdit && !canHardDelete) {
        addToast('Bạn không có quyền xóa tài liệu', 'error');
        throw new Error('Insufficient permissions');
      }
      await deleteTaiLieu(id);
      fetchTaiLieus();
      addToast('Xóa tài liệu thành công', 'success');
    } catch (error) {
      console.error('Error deleting tài liệu:', error);
      addToast('Lỗi khi xóa tài liệu', 'error');
    }
  };

  // Phân quyền
  const canEdit = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canHardDelete = userRole === 'TruongDoan';

  return {
    taiLieuList,
    filteredTaiLieuList,
    keHoachList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    userRole,
    fetchUserInfo,
    fetchTaiLieus,
    toggleSortOrder,
    handleCreate,
    handleDelete,
    canEdit,
    canHardDelete,
  };
};