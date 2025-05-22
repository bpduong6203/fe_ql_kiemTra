import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { LoginError } from '@/types/auth';
import type { DonVi, NguoiDung, Roles } from '@/types/interfaces';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await api.request<T>({
      url: endpoint,
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<LoginError>;
    if (axiosError.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/403';
      }
      throw new Error('Bạn không có quyền truy cập');
    }
    throw new Error(axiosError.response?.data?.message || 'Lỗi không xác định');
  }
}

export async function fetchApiNoToken<T = unknown>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await api.request<T>({
      url: endpoint,
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<LoginError>;
    if (axiosError.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/403';
      }
      throw new Error('Bạn không có quyền truy cập');
    }
    throw new Error(axiosError.response?.data?.message || 'Lỗi không xác định');
  }
}

// Upload file
export async function uploadFile(file: File): Promise<{ fileName: string; url: string }> {
  const formData = new FormData();
  formData.append('file', file);
 try {
    const response = await api.post<{ fileName: string; url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<LoginError>;
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi upload file');
  }
}


// Don Vi APIs
export async function getDonVis(): Promise<DonVi[]> {
  return apiFetch('/donvi', { method: 'GET' });
}

export async function getDonVi(id: string): Promise<DonVi> {
  return apiFetch(`/donvi/${id}`, { method: 'GET' });
}

export async function createDonVi(data: Partial<DonVi>): Promise<DonVi> {
  return apiFetch('/donvi', { method: 'POST', data });
}

export async function updateDonVi(id: string, data: Partial<DonVi>): Promise<DonVi> {
  return apiFetch(`/donvi/${id}`, { method: 'PUT', data });
}

export async function softDeleteDonVi(id: string): Promise<{ message: string }> {
  return apiFetch(`/donvi/soft/${id}`, { method: 'DELETE' });
}

export async function hardDeleteDonVi(id: string): Promise<{ message: string }> {
  return apiFetch(`/donvi/hard/${id}`, { method: 'DELETE' });
}

// Roles APIs
export async function getAllRoles(): Promise<Roles[]> {
  return apiFetch('/auth/roles', { method: 'GET' });
}

// User APIs
export async function getAllUsers(): Promise<NguoiDung[]> {
  return apiFetch('/auth/users', { method: 'GET' });
}

export async function getDeletedUsers(): Promise<NguoiDung[]> {
  return apiFetch('/auth/users/deleted', { method: 'GET' });
}

export async function createUser(data: Partial<NguoiDung>): Promise<{ message: string; id: string }> {
  return apiFetch('/auth/users', { method: 'POST', data });
}

export async function updateUser(id: string, data: Partial<NguoiDung>): Promise<{ message: string }> {
  return apiFetch(`/auth/users/${id}`, { method: 'PUT', data });
}

export async function updateUserRole(id: string, roleID: string): Promise<{ message: string }> {
  return apiFetch(`/auth/users/${id}/role`, { method: 'PATCH', data: { roleID } });
}

export async function updateUserDonVi(id: string, donViID: string): Promise<{ message: string }> {
  return apiFetch(`/auth/users/${id}/donvi`, { method: 'PATCH', data: { donViID } });
}

export async function softDeleteUser(id: string): Promise<{ message: string }> {
  return apiFetch(`/auth/users/soft/${id}`, { method: 'DELETE' });
}

export async function hardDeleteUser(id: string): Promise<{ message: string }> {
  return apiFetch(`/auth/users/hard/${id}`, { method: 'DELETE' });
}

// Get user info
export async function getUserInfo(): Promise<{ userId: string; role: string }> {
  return apiFetch('/auth/user', { method: 'GET' });
}