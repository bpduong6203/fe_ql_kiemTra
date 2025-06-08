import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/toast-provider';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/lib/apithongbao';
import type { ThongBao } from '@/types/interfaces';
import { useNavigate } from 'react-router-dom';
import { useSelectedPlan } from '@/context/SelectedPlanContext';
import { useKeHoach } from '@/page/dashboard/hooks/useKeHoach';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<ThongBao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { setSelectedPlanGlobally } = useSelectedPlan();
  const { keHoachList, fetchKeHoachs } = useKeHoach();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchKeHoachs(); 
      const data = await getNotifications();
      const parsedNotifications = data.map(n => ({
        ...n,
        ngayTao: new Date(n.ngayTao) 
      }));
      setNotifications(parsedNotifications);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải thông báo');
      addToast(err.message || 'Lỗi khi tải thông báo', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, fetchKeHoachs]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, daXem: true } : n))
      );
    } catch (err: any) {
      addToast(err.message || 'Lỗi khi đánh dấu đã đọc', 'error');
    }
  }, [addToast]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, daXem: true })));
    } catch (err: any) {
      addToast(err.message || 'Lỗi khi đánh dấu tất cả đã đọc', 'error');
    }
  }, [addToast]);

  const handleDeleteNotification = useCallback(async (id: string) => { 
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      addToast(err.message || 'Lỗi khi xóa thông báo', 'error');
    }
  }, [addToast]);

  const handleNotificationClick = useCallback(async (notification: ThongBao) => {
    if (!notification.daXem) {
      await handleMarkAsRead(notification.id);
    }

    const selectedKeHoach = keHoachList.find(kh => kh.id === notification.keHoachID);
    if (selectedKeHoach) {
      const plan = {
        id: selectedKeHoach.id,
        name: selectedKeHoach.tenKeHoach,
        createdAt: selectedKeHoach.ngayBatDau,
      };
      setSelectedPlanGlobally(plan); 
    } else {
      addToast('Không tìm thấy kế hoạch liên quan đến thông báo', 'error');
    }

    if (notification.redirectUrl) {
      navigate(notification.redirectUrl);
    }
  }, [handleMarkAsRead, navigate, setSelectedPlanGlobally, keHoachList, addToast]);

  const unreadCount = notifications.filter(n => !n.daXem).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleNotificationClick,
  };
};