// apiTaiLieu.ts
import { apiFetch } from './api';
import type { TaiLieu } from '@/types/interfaces'; 

// Lấy tất cả tài liệu
export async function getTaiLieus(): Promise<TaiLieu[]> {
  return apiFetch('/tailieu', { method: 'GET' });
}

// Lấy tài liệu theo ID
export async function getTaiLieuById(id: string): Promise<TaiLieu> {
  return apiFetch(`/tailieu/${id}`, { method: 'GET' });
}

// Tạo mới tài liệu (sau khi đã upload file)
export async function createTaiLieu(
  tenFile: string,
  linkFile: string, 
  keHoachId: string,
  loaiTaiLieu: number
): Promise<TaiLieu> {
  const data = {
    tenFile,
    linkFile,
    keHoachId,
    loaiTaiLieu,
  };

  return apiFetch('/tailieu', {
    method: 'POST',
    data: data, 
  });
}

// Xóa tài liệu
export async function deleteTaiLieu(id: string): Promise<void> {
  return apiFetch(`/tailieu/${id}`, { method: 'DELETE' });
}