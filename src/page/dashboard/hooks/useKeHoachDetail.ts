import { useState, useEffect, useCallback } from 'react';
import { getKeHoachById } from '@/lib/apiKeHoach';
import { getTaiLieus } from '@/lib/apiTaiLieu';
import type { KeHoach, TaiLieu } from '@/types/interfaces';
import { useToast } from '@/components/toast-provider';

export const useKeHoachDetail = (keHoachId: string) => {
  const [keHoach, setKeHoach] = useState<KeHoach | null>(null);
  const [taiLieus, setTaiLieus] = useState<TaiLieu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchKeHoachDetail = useCallback(async () => {
    if (!keHoachId) {
      setError('Không có ID kế hoạch');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [keHoachData, taiLieuData] = await Promise.all([
        getKeHoachById(keHoachId),
        getTaiLieus(), // Lấy tất cả tài liệu
      ]);
      setKeHoach(keHoachData);
      // Lọc tài liệu theo keHoachId
      setTaiLieus(taiLieuData.filter((taiLieu) => taiLieu.keHoachId === keHoachId));
      setError(null);
    } catch (err) {
      setError('Lỗi khi lấy chi tiết kế hoạch hoặc tài liệu');
      addToast('Lỗi khi lấy chi tiết kế hoạch', 'error');
    } finally {
      setLoading(false);
    }
  }, [keHoachId, addToast]);

  useEffect(() => {
    fetchKeHoachDetail();
  }, [fetchKeHoachDetail]);

  return { keHoach, taiLieus, loading, error, fetchKeHoachDetail };
};