import { useState, useEffect, useCallback } from 'react';
import {
  getPhanCongUsers,
  createPhanCongUser,
  updatePhanCongUser,
  deletePhanCongUser,
  type PhanCongUserDto,
} from '@/lib/apiPhanCong';
import { getUserInfo, uploadFile } from '@/lib/api';
import type { PhanCongUser, NguoiDung } from '@/types/interfaces';
import { useToast } from '@/components/toast-provider';
import { useSelectedPlan } from '@/context/SelectedPlanContext'; 
import { getAllUsers } from '@/lib/apiuser';

export const usePhanCong = () => {
  const [phanCongList, setPhanCongList] = useState<PhanCongUser[]>([]);
  const [filteredPhanCongList, setFilteredPhanCongList] = useState<PhanCongUser[]>([]);
  const [nguoiDungList, setNguoiDungList] = useState<NguoiDung[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);

  const { selectedPlan } = useSelectedPlan(); 
  const { addToast } = useToast();

  // Lấy thông tin user để kiểm tra role
  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = await getUserInfo();
      setUserRole(userInfo.role);
    } catch (error) {
    }
  }, []);

  // Lấy danh sách phân công và người dùng
  const fetchPhanCongData = useCallback(async () => {
    if (!selectedPlan?.id) {
      setPhanCongList([]);
      setFilteredPhanCongList([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [phanCongs, nguoiDungs] = await Promise.all([
        getPhanCongUsers(), 
        getAllUsers(),
      ]);

      // Lọc các phân công chỉ thuộc về kế hoạch đang chọn
      const phanCongsForSelectedPlan = phanCongs.filter(pc => pc.keHoachID === selectedPlan.id);

      // Sắp xếp theo tên người dùng
      const sortedPhanCongs = phanCongsForSelectedPlan.sort((a: PhanCongUser, b: PhanCongUser) =>
        sortOrder === 'asc'
          ? a.nguoiDung.hoTen.localeCompare(b.nguoiDung.hoTen)
          : b.nguoiDung.hoTen.localeCompare(a.nguoiDung.hoTen)
      );

      setPhanCongList(sortedPhanCongs);
      setFilteredPhanCongList(sortedPhanCongs);
      setNguoiDungList(nguoiDungs);
    } catch (error) {
      addToast('Lỗi khi tải dữ liệu phân công', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedPlan, sortOrder, addToast]); 

  // Tự động load dữ liệu khi hook khởi tạo hoặc selectedPlan thay đổi
  useEffect(() => {
    fetchUserInfo();
    fetchPhanCongData();
  }, [fetchUserInfo, fetchPhanCongData]);

  useEffect(() => {
    const filtered = phanCongList.filter((phanCong) =>
      phanCong.nguoiDung.hoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phanCong.noiDungCV.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPhanCongList(filtered);
  }, [searchQuery, phanCongList]);

  // Sắp xếp
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setFilteredPhanCongList([...filteredPhanCongList].sort((a, b) =>
      newSortOrder === 'asc'
        ? a.nguoiDung.hoTen.localeCompare(b.nguoiDung.hoTen)
        : b.nguoiDung.hoTen.localeCompare(a.nguoiDung.hoTen)
    ));
    addToast(`Sắp xếp theo thứ tự ${newSortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}`, 'success');
  };

  // Tạo mới / Cập nhật phân công
  const handleSave = async (
    data: {
      file?: File | null;
      userID: string; 
      noiDungCV: string;
      currentLinkFile?: string;
    },
    mode: 'create' | 'edit',
    phanCongId?: string
  ) => {
    if (!selectedPlan?.id) {
      addToast('Vui lòng chọn một kế hoạch trước khi phân công.', 'error');
      return;
    }

    setLoading(true);
    try {
      let finalLinkFile = data.currentLinkFile || '';

      if (data.file) {
        const uploadResult = await uploadFile(data.file);
        finalLinkFile = uploadResult.url;
        addToast('Upload file thành công', 'success');
      } else if (mode === 'create' && !data.file) {
      }

      const phanCongDto: PhanCongUserDto = {
        keHoachID: selectedPlan.id, 
        userID: data.userID,
        linkFile: finalLinkFile,
        noiDungCV: data.noiDungCV,
      };

      if (mode === 'create') {
        await createPhanCongUser(phanCongDto);
        addToast('Tạo phân công thành công', 'success');
      } else {
        if (!phanCongId) throw new Error('PhanCong ID is required for editing.');
        await updatePhanCongUser(phanCongId, phanCongDto);
        addToast('Cập nhật phân công thành công', 'success');
      }
      fetchPhanCongData();
    } catch (error) {
      addToast(`Lỗi khi ${mode === 'create' ? 'tạo' : 'cập nhật'} phân công`, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Xóa phân công
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      if (!canEdit && !canHardDelete) {
        addToast('Bạn không có quyền xóa phân công', 'error');
        throw new Error('Insufficient permissions');
      }
      await deletePhanCongUser(id);
      addToast('Xóa phân công thành công', 'success');
      fetchPhanCongData();
    } catch (error) {
      addToast('Lỗi khi xóa phân công', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Phân quyền
  const canEdit = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canHardDelete = userRole === 'TruongDoan';

  return {
    phanCongList,
    filteredPhanCongList,
    nguoiDungList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    userRole,
    fetchUserInfo,
    fetchPhanCongData,
    toggleSortOrder,
    handleSave,
    handleDelete,
    canEdit,
    canHardDelete,
    selectedPlan, 
  };
};