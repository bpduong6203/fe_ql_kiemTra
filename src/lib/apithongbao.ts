import type { ThongBao } from '@/types/interfaces'; 
import { apiFetch } from './api';

// Lấy danh sách thông báo của người dùng hiện tại
export async function getNotifications(): Promise<ThongBao[]> {
  return apiFetch<ThongBao[]>('/ThongBao', { method: 'GET' });
}

// Đánh dấu một thông báo đã xem
export async function markNotificationAsRead(id: string): Promise<void> {
  return apiFetch<void>(`/ThongBao/${id}/markAsRead`, { method: 'PUT' });
}

// Đánh dấu tất cả thông báo của người dùng đã xem
export async function markAllNotificationsAsRead(): Promise<void> {
  return apiFetch<void>('/ThongBao/markAllAsRead', { method: 'PUT' });
}

// Xóa một thông báo
export async function deleteNotification(id: string): Promise<void> {
  return apiFetch<void>(`/ThongBao/${id}`, { method: 'DELETE' });
}