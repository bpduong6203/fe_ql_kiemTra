import { apiFetch } from './api';
import type { KeHoach } from '@/types/interfaces';

// Lấy tất cả kế hoạch
export async function getKeHoachs(): Promise<KeHoach[]> {
  return apiFetch('/kehoach', { method: 'GET' });
}

// Lấy kế hoạch theo ID
export async function getKeHoachById(id: string): Promise<KeHoach> {
  return apiFetch(`/kehoach/${id}`, { method: 'GET' });
}

// Lấy danh sách kế hoạch đã xóa mềm
export async function getDeletedKeHoachs(): Promise<KeHoach[]> {
  return apiFetch('/kehoach/deleted', { method: 'GET' });
}

// Tạo mới kế hoạch
export async function createKeHoach(data: Partial<KeHoach>): Promise<KeHoach> {
  return apiFetch('/kehoach', { method: 'POST', data, });
}

// Cập nhật kế hoạch
export async function updateKeHoach(id: string, data: Partial<KeHoach>): Promise<KeHoach> {
  return apiFetch(`/kehoach/${id}`, { method: 'PUT', data, });
}

// Xóa mềm kế hoạch
export async function softDeleteKeHoach(id: string): Promise<void> {
  return apiFetch(`/kehoach/${id}`, { method: 'DELETE' });
}

// Xóa vĩnh viễn kế hoạch
export async function hardDeleteKeHoach(id: string): Promise<void> {
  return apiFetch(`/kehoach/${id}/permanent`, { method: 'DELETE' });
}

// Khôi phục kế hoạch
export async function restoreKeHoach(id: string): Promise<void> {
  return apiFetch(`/kehoach/${id}/restore`, { method: 'POST' });
}