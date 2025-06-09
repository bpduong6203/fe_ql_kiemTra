import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/toast-provider';
import { useKeHoach } from '@/page/dashboard/hooks/useKeHoach';
import { getGiaiTrinhs } from '@/lib/apiGiaiTrinh'; 
import type { GiaiTrinh } from '@/types/interfaces';

interface DashboardData {
    loading: boolean;
    error: string | null;
    projectStatusData: { name: string; value: number }[]; 
    taskCompletionData: { name: string; value: number }[]; 
    totalProjects: number;
    completedProjects: number;
    pendingGiaiTrinhs: number;
}

export const useDashboardData = (): DashboardData => {
    const { addToast } = useToast();
    const { keHoachList, loading: keHoachLoading, fetchKeHoachs } = useKeHoach();
    const [allGiaiTrinhs, setAllGiaiTrinhs] = useState<GiaiTrinh[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllGiaiTrinhs = useCallback(async () => {
        try {
            const data = await getGiaiTrinhs(); 
            setAllGiaiTrinhs(data);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải dữ liệu giải trình.');
            addToast('Lỗi khi tải dữ liệu giải trình cho dashboard.', 'error');
        }
    }, [addToast]);

    useEffect(() => {
        if (!keHoachLoading && keHoachList.length === 0) {
            fetchKeHoachs();
        }
        fetchAllGiaiTrinhs(); 
    }, [keHoachLoading, keHoachList.length, fetchKeHoachs, fetchAllGiaiTrinhs]);


    useEffect(() => {
        if (!keHoachLoading && !error && (allGiaiTrinhs.length > 0 || keHoachList.length > 0)) {
            setLoading(false);
        } else if (!keHoachLoading && !error && allGiaiTrinhs.length === 0 && keHoachList.length === 0) {
             setLoading(false);
        }
    }, [keHoachLoading, error, allGiaiTrinhs.length, keHoachList.length]);

    const projectStatusData = useMemo(() => {
        const statusCounts: { [key: string]: number } = {
            'Đang diễn ra': 0,
            'Sắp bắt đầu': 0,
            'Đã kết thúc': 0,
            'Bị xóa': 0, 
        };

        const now = new Date();

        keHoachList.forEach(kh => {
            if (kh.isDeleted) {
                statusCounts['Bị xóa']++;
                return; 
            }

            const ngayBatDau = new Date(kh.ngayBatDau);
            const ngayKetThuc = new Date(kh.ngayKetThuc);

            if (ngayBatDau > now) {
                statusCounts['Sắp bắt đầu']++;
            } else if (ngayKetThuc < now) {
                statusCounts['Đã kết thúc']++;
            } else {
                statusCounts['Đang diễn ra']++;
            }
        });

        return Object.entries(statusCounts)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    }, [keHoachList]); 

    // Logic xử lý dữ liệu cho biểu đồ "Tiến Độ Hoàn Thành Công Việc"
    const taskCompletionData = useMemo(() => {
        const completionCounts: { [name: string]: number } = {
            'Đã Đạt': 0,
            'Chưa Đạt': 0,
            'Đang Chờ': 0,
        };

        allGiaiTrinhs.forEach(gt => {
            const status = gt.trangThaiTongThe;
            if (status === 'Đạt') {
                completionCounts['Đã Đạt']++;
            } else if (status === 'Chưa Đạt') {
                completionCounts['Chưa Đạt']++;
            } else {
                completionCounts['Đang Chờ']++;
            }
        });

        return Object.entries(completionCounts)
            .filter(([, value]) => value > 0) 
            .map(([name, value]) => ({ name, value }));
    }, [allGiaiTrinhs]); // Chỉ phụ thuộc vào allGiaiTrinhs

    // Các số liệu KPI
    const totalProjects = keHoachList.filter(kh => !kh.isDeleted).length;
    const completedProjects = keHoachList.filter(kh => {
        if (kh.isDeleted) return false;
        const relatedGiaiTrinhs = allGiaiTrinhs.filter(gt => gt.keHoachID === kh.id);
        return relatedGiaiTrinhs.length > 0 && relatedGiaiTrinhs.every(gt => gt.trangThaiTongThe === 'Đạt');
    }).length;


    const pendingGiaiTrinhs = allGiaiTrinhs.filter(gt => gt.trangThaiTongThe === 'Chờ Giải Trình').length;


    return {
        loading,
        error,
        projectStatusData,
        taskCompletionData,
        totalProjects,
        completedProjects,
        pendingGiaiTrinhs,
    };
};