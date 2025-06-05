import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/toast-provider';
import { uploadFile, getUserInfo } from '@/lib/api'; 
import { 
    getGiaiTrinhs, 
    updateGiaiTrinh, 
    deleteGiaiTrinh, 
    createGiaiTrinh, 
    type GiaiTrinhPayload, 
} from '@/lib/apiGiaiTrinh'; 
import { useSelectedPlan } from '@/context/SelectedPlanContext';
import { getAllUsers } from '@/lib/apiuser';
import type { GiaiTrinh, NguoiDung } from '@/types/interfaces'; 
import { createGiaiTrinhFile, deleteGiaiTrinhFile } from '@/lib/apiGiaiTrinhFile';

export const useGiaiTrinh = () => {
  const [giaiTrinh, setGiaiTrinh] = useState<GiaiTrinh | null>(null);
  const [nguoiDungList, setNguoiDungList] = useState<NguoiDung[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const [selectedLocalFiles, setSelectedLocalFiles] = useState<File[]>([]);

  const { selectedPlan } = useSelectedPlan();
  const { addToast } = useToast();

  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = await getUserInfo(); 
      setUserRole(userInfo.role);
      setCurrentUsername(userInfo.username);
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
      setUserRole(null);
      setCurrentUsername(null);
    }
  }, []);

  const fetchGiaiTrinhForSelectedPlan = useCallback(async () => {
    if (!selectedPlan?.id) {
      setGiaiTrinh(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const allGiaiTrinhs = await getGiaiTrinhs(); 
      const foundGiaiTrinh = allGiaiTrinhs.find(gt => gt.keHoachID === selectedPlan.id);
      
      setGiaiTrinh(foundGiaiTrinh || null);

      const nguoiDungs = await getAllUsers();
      setNguoiDungList(nguoiDungs);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu giải trình:', error);
      addToast('Lỗi khi tải dữ liệu giải trình', 'error');
      setGiaiTrinh(null);
    } finally {
      setLoading(false);
    }
  }, [selectedPlan, addToast]);

  useEffect(() => {
    fetchUserInfo();
    fetchGiaiTrinhForSelectedPlan();
  }, [fetchUserInfo, fetchGiaiTrinhForSelectedPlan]);

  const handleLocalFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const allowedFiles = filesArray.filter(file => 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.type === 'application/pdf'
      );
      if (allowedFiles.length !== filesArray.length) {
          addToast('Chỉ chấp nhận tệp định dạng Word (.doc, .docx) và PDF (.pdf).', 'error');
      }
      setSelectedLocalFiles(prev => [...prev, ...allowedFiles]);
      e.target.value = '';
    }
  }, [addToast]);

  const handleRemoveLocalFile = useCallback((indexToRemove: number) => {
    setSelectedLocalFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleSaveGiaiTrinh = async (
    data: {
      keHoachID: string;
      nguoiGiaiTrinhID: string;
      trangThaiTongThe?: string;
    },
    currentGiaiTrinhId: string | null
  ) => {
    if (!selectedPlan?.id) {
      addToast('Vui lòng chọn một kế hoạch.', 'error');
      return;
    }
    if (!data.nguoiGiaiTrinhID) {
      addToast('Vui lòng chọn người giải trình.', 'error');
      return;
    }
    if (currentGiaiTrinhId === null && selectedLocalFiles.length === 0) {
        addToast('Vui lòng tải lên ít nhất một tệp để tạo yêu cầu giải trình.', 'error');
        return;
    }

    setLoading(true);
    let idOfGiaiTrinhToAttachFiles = currentGiaiTrinhId;

    try {
        if (currentGiaiTrinhId === null) {
            const createPayload: GiaiTrinhPayload = {
                keHoachID: data.keHoachID,
                nguoiGiaiTrinhID: data.nguoiGiaiTrinhID,
                trangThaiTongThe: "Chờ Giải Trình"
            };
            const newGiaiTrinhResponse = await createGiaiTrinh(createPayload); 
            idOfGiaiTrinhToAttachFiles = newGiaiTrinhResponse.id; 
            addToast('Yêu cầu giải trình đã được tạo thành công!', 'success');
        } else { 
            const updatePayload: GiaiTrinhPayload = {
                keHoachID: data.keHoachID, 
                nguoiGiaiTrinhID: data.nguoiGiaiTrinhID,
                trangThaiTongThe: data.trangThaiTongThe 
            };
            await updateGiaiTrinh(currentGiaiTrinhId, updatePayload);
            addToast('Cập nhật giải trình thành công', 'success');
        }

        if (idOfGiaiTrinhToAttachFiles && selectedLocalFiles.length > 0) {
            for (const file of selectedLocalFiles) {
                const uploadResult = await uploadFile(file);
                await createGiaiTrinhFile({
                    giaiTrinhID: idOfGiaiTrinhToAttachFiles,
                    tenFile: file.name,
                    linkFile: uploadResult.url,
                });
            }
            addToast('Tải lên tệp đính kèm thành công!', 'success');
        }

        await fetchGiaiTrinhForSelectedPlan();
        setSelectedLocalFiles([]);
    } catch (error) {
      console.error(`Lỗi khi lưu giải trình:`, error);
      addToast(`Lỗi khi lưu giải trình`, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGiaiTrinh = async (giaiTrinhId: string) => {
    setLoading(true);
    try {
        if (!canEditGiaiTrinh) {
            addToast('Bạn không có quyền hoàn thành giải trình', 'error');
            throw new Error('Không đủ quyền hạn');
        }
        await updateGiaiTrinh(giaiTrinhId, {
            keHoachID: giaiTrinh?.keHoachID || '',
            nguoiGiaiTrinhID: giaiTrinh?.nguoiGiaiTrinhID || '',
            trangThaiTongThe: 'Đã Giải Trình'
        });
        
        addToast('Giải trình đã được đánh dấu hoàn thành!', 'success');
        await fetchGiaiTrinhForSelectedPlan();
    } catch (error) {
        console.error('Lỗi khi hoàn thành giải trình:', error);
        addToast('Lỗi khi hoàn thành giải trình', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteGiaiTrinh = async (id: string) => {
    setLoading(true);
    try {
      if (!canDeleteGiaiTrinh) {
        addToast('Bạn không có quyền xóa giải trình', 'error');
        throw new Error('Không đủ quyền hạn');
      }
      await deleteGiaiTrinh(id);
      addToast('Xóa giải trình thành công', 'success');
      await fetchGiaiTrinhForSelectedPlan();
    } catch (error) {
      console.error('Lỗi khi xóa giải trình:', error);
      addToast('Lỗi khi xóa giải trình', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGiaiTrinhFile = async (fileId: string) => {
    setLoading(true);
    try {
        await deleteGiaiTrinhFile(fileId); 
        addToast('Xóa file giải trình thành công', 'success');
        await fetchGiaiTrinhForSelectedPlan();
    } catch (error) {
        console.error('Lỗi khi xóa file giải trình:', error);
        addToast('Lỗi khi xóa file giải trình', 'error');
    } finally {
        setLoading(false);
    }
  };

  const canCreateGiaiTrinh = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canEditGiaiTrinh = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canDeleteGiaiTrinh = userRole === 'TruongDoan';

  const canUploadGiaiTrinhFile = userRole === 'TruongDoan' || userRole === 'ThanhVien';
  const canDeleteGiaiTrinhFile = userRole === 'TruongDoan' || userRole === 'ThanhVien';

  const canAddNDGiaiTrinh = (giaiTrinh?.nguoiGiaiTrinh?.username === currentUsername && (userRole === 'DonVi' || userRole === 'ThanhVien')) || (userRole === 'TruongDoan');
  
  return {
    giaiTrinh,
    nguoiDungList,
    loading,
    userRole,
    currentUsername,
    fetchGiaiTrinhForSelectedPlan,
    handleSaveGiaiTrinh,
    handleDeleteGiaiTrinh,
    handleDeleteGiaiTrinhFile,
    handleCompleteGiaiTrinh,
    canCreateGiaiTrinh,
    canEditGiaiTrinh,
    canDeleteGiaiTrinh,
    canUploadGiaiTrinhFile,
    canDeleteGiaiTrinhFile,
    selectedPlan,
    
    selectedLocalFiles,
    setSelectedLocalFiles,
    handleLocalFilesChange,
    handleRemoveLocalFile,
    canAddNDGiaiTrinh,
  };
};