import { apiFetch } from './api';
import type { PhanCongUser } from '@/types/interfaces'; 

export interface PhanCongUserDto {
  keHoachID: string;
  userID: string;
  linkFile: string;
  noiDungCV: string;
}

export async function getPhanCongUsers(): Promise<PhanCongUser[]> {
  try {
    const response = await apiFetch<PhanCongUser[]>('/PhanCongUser', { method: 'GET' });
    return response;
  } catch (error) {
    console.error('Error fetching phan cong users:', error);
    throw error;
  }
}

// Lấy phân công người dùng theo ID
export async function getPhanCongUserById(id: string): Promise<PhanCongUser> {
  try {
    const response = await apiFetch<PhanCongUser>(`/PhanCongUser/${id}`, { method: 'GET' });
    return response;
  } catch (error) {
    console.error(`Error fetching phan cong user with ID ${id}:`, error);
    throw error;
  }
}

// Tạo mới phân công người dùng
export async function createPhanCongUser(data: PhanCongUserDto): Promise<PhanCongUser> {
  try {
    const response = await apiFetch<PhanCongUser>('/PhanCongUser', {
      method: 'POST',
      data: data,
    });
    return response;
  } catch (error) {
    console.error('Error creating phan cong user:', error);
    throw error;
  }
}

// Cập nhật phân công người dùng
export async function updatePhanCongUser(id: string, data: PhanCongUserDto): Promise<void> {
  try {
    await apiFetch(`/PhanCongUser/${id}`, {
      method: 'PUT',
      data: data,
    });
  } catch (error) {
    console.error(`Error updating phan cong user with ID ${id}:`, error);
    throw error;
  }
}

// Xóa phân công người dùng
export async function deletePhanCongUser(id: string): Promise<void> {
  try {
    await apiFetch(`/PhanCongUser/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error(`Error deleting phan cong user with ID ${id}:`, error);
    throw error;
  }
}
