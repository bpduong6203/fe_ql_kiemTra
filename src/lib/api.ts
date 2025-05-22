import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { LoginError } from '@/types/auth';
import type { DonVi } from '@/types/interfaces';

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

//================ Don Vi ====================================

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

//============================================================


// Lấy thông tin user để kiểm tra role
export async function getUserInfo(): Promise<{ username: string; role: string }> {
  return apiFetch('/auth/user', { method: 'GET' });
}


