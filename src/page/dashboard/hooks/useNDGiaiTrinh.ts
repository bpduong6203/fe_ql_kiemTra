import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/toast-provider';
import { uploadFile, getUserInfo } from '@/lib/api';
import { 
    getNDGiaiTrinhsByGiaiTrinhId, 
    createNDGiaiTrinh, 
    updateNDGiaiTrinh, 
    deleteNDGiaiTrinh,
    danhGiaNDGiaiTrinh,
} from '@/lib/apiNDGiaiTrinh';
import type { NDGiaiTrinh } from '@/types/interfaces';

interface NDGiaiTrinhPayload {
    giaiTrinhID: string;
    noiDung?: string;
    tenFile?: string;
    linkFile?: string;
    nguoiDanhGiaID?: string;
    trangThai?: 'Chờ Đánh Giá' | 'Đạt' | 'Chưa Đạt' | 'Đã Sửa';
}
  
interface DanhGiaNDGiaiTrinhPayload {
    trangThai: 'Đạt' | 'Chưa Đạt'; 
}

export const useNDGiaiTrinh = (giaiTrinhId: string | null) => {
    const [ndGiaiTrinhList, setNdGiaiTrinhList] = useState<NDGiaiTrinh[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { addToast } = useToast();

    const [selectedNDFile, setSelectedNDFile] = useState<File | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);

    const fetchUserInfo = useCallback(async () => {
        try {
            const userInfo = await getUserInfo();
            setUserRole(userInfo.role);
            setCurrentUsername(userInfo.username);
        } catch (error) {
            setUserRole(null);
            setCurrentUsername(null);
        }
    }, []);

    const fetchNDGiaiTrinhs = useCallback(async () => {
        if (!giaiTrinhId) {
            setNdGiaiTrinhList([]);
            return;
        }
        setLoading(true);
        try {
            const data = await getNDGiaiTrinhsByGiaiTrinhId(giaiTrinhId);
            const sortedData = data.sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime());
            setNdGiaiTrinhList(sortedData);
        } catch (error: any) { 
            if (error.response && error.response.status === 404) {
                setNdGiaiTrinhList([]);
            } else {
                addToast("Lỗi khi tải nội dung giải trình", "error"); 
                setNdGiaiTrinhList([]);
            }
        } finally {
            setLoading(false);
        }
    }, [giaiTrinhId, addToast]);

    useEffect(() => {
        fetchUserInfo(); 
        fetchNDGiaiTrinhs();
    }, [fetchUserInfo, fetchNDGiaiTrinhs]); 

    const handleNDFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                addToast('Chỉ chấp nhận tệp định dạng Word (.doc, .docx) và PDF (.pdf) cho nội dung giải trình.', 'error');
                setSelectedNDFile(null);
                e.target.value = '';
                return;
            }
            setSelectedNDFile(file);
        } else {
            setSelectedNDFile(null);
        }
    }, [addToast]);

    const handleRemoveNDFile = useCallback(() => {
        setSelectedNDFile(null);
    }, []);

    const handleSaveNDGiaiTrinh = async (
        data: {
            NoiDung: string;
            GiaiTrinhID: string;
        },
        ndGiaiTrinhId: string | null
    ) => {
        if (!data.GiaiTrinhID) {
            addToast("Không tìm thấy ID Giải Trình.", "error");
            return;
        }

        setLoading(true);
        let linkFile: string | undefined = undefined;
        let tenFile: string | undefined = undefined;
        let newTrangThai: 'Chờ Đánh Giá' | 'Đạt' | 'Chưa Đạt' | 'Đã Sửa' | undefined = undefined;

        try {
            const existingNDGiaiTrinh = ndGiaiTrinhList.find(nd => nd.id === ndGiaiTrinhId);

            if (selectedNDFile) {
                const uploadResult = await uploadFile(selectedNDFile);
                linkFile = uploadResult.url;
                tenFile = selectedNDFile.name;

                if (existingNDGiaiTrinh?.trangThai === 'Chưa Đạt') {
                    newTrangThai = 'Đã Sửa';
                }
            } else if (existingNDGiaiTrinh) {
                linkFile = existingNDGiaiTrinh.linkFile;
                tenFile = existingNDGiaiTrinh.tenFile;
            }
            
            if (existingNDGiaiTrinh?.trangThai === 'Chưa Đạt' && data.NoiDung !== existingNDGiaiTrinh.noiDung && !selectedNDFile) {
                newTrangThai = 'Đã Sửa';
            }

            if (newTrangThai === undefined && existingNDGiaiTrinh) {
                newTrangThai = existingNDGiaiTrinh.trangThai as 'Chờ Đánh Giá' | 'Đạt' | 'Chưa Đạt' | 'Đã Sửa';
            }


            const payload: NDGiaiTrinhPayload = {
                giaiTrinhID: data.GiaiTrinhID,
                noiDung: data.NoiDung,
                linkFile: linkFile,
                tenFile: tenFile,
                trangThai: newTrangThai,
            };

            if (ndGiaiTrinhId) { 
                await updateNDGiaiTrinh(ndGiaiTrinhId, payload);
                addToast("Cập nhật nội dung giải trình thành công!", "success");
            } else { 
                if (!payload.linkFile && !payload.noiDung) {
                     addToast("Vui lòng nhập nội dung hoặc chọn tệp.", "error");
                     setLoading(false);
                     return;
                }
                payload.trangThai = 'Chờ Đánh Giá';
                await createNDGiaiTrinh(payload);
                addToast("Thêm nội dung giải trình thành công!", "success");
            }

            setSelectedNDFile(null); 
            await fetchNDGiaiTrinhs();
        } catch (error) {
            addToast("Lỗi khi lưu nội dung giải trình", "error");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNDGiaiTrinh = async (id: string) => {
        setLoading(true);
        try {
            await deleteNDGiaiTrinh(id);
            addToast("Xóa nội dung giải trình thành công!", "success");
            await fetchNDGiaiTrinhs();
        } catch (error) {
            addToast("Lỗi khi xóa nội dung giải trình", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDanhGiaNDGiaiTrinh = async (id: string, trangThai: "Đạt" | "Chưa Đạt") => {
        setLoading(true);
        try {
            if (userRole !== 'TruongDoan') { 
                addToast('Bạn không có quyền đánh giá nội dung giải trình.', 'error');
                setLoading(false);
                return;
            }
            const payload: DanhGiaNDGiaiTrinhPayload = { trangThai: trangThai };
            await danhGiaNDGiaiTrinh(id, payload);
            addToast(`Đã đánh giá nội dung giải trình: ${trangThai}`, "success");
            await fetchNDGiaiTrinhs();
        } catch (error) {
            addToast("Lỗi khi đánh giá nội dung giải trình", "error");
        } finally {
            setLoading(false);
        }
    };

    const canManipulateND = useCallback((ndGiaiTrinh: NDGiaiTrinh) => {
        const isGiaiTrinhExplainer = ndGiaiTrinh.giaiTrinh?.nguoiGiaiTrinh?.username === currentUsername;
        const canExplainerManipulate = isGiaiTrinhExplainer && (userRole === 'DonVi' || userRole === 'ThanhVien');
        const hasOverallEditPermission = userRole === 'TruongDoan';

        return canExplainerManipulate || hasOverallEditPermission; 
    }, [currentUsername, userRole]);


    return {
        ndGiaiTrinhList,
        loading,
        fetchNDGiaiTrinhs,
        handleNDFileChange,
        selectedNDFile,
        handleRemoveNDFile,
        handleSaveNDGiaiTrinh,
        handleDeleteNDGiaiTrinh,
        handleDanhGiaNDGiaiTrinh,
        canManipulateND, 
    };
};