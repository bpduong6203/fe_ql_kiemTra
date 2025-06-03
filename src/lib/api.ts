import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { LoginError } from '@/types/auth';
import type { NguoiDung, Roles } from '@/types/interfaces';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
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

// Roles APIs
export async function getAllRoles(): Promise<Roles[]> {
  return apiFetch('/auth/roles', { method: 'GET' });
}

// Get user info
export async function getUserInfo(): Promise<NguoiDung> {
  const response = await apiFetch<NguoiDung>('/auth/user', { method: 'GET' });
  return response; 
}