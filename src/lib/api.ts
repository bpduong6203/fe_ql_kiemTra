import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { LoginError } from '@/types/auth';
import type { Roles } from '@/types/interfaces';

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
    if (typeof window !== 'undefined' && axiosError.response?.status) {
      const statusCode = axiosError.response.status;
      switch (statusCode) {
        case 401:
          window.location.href = '/Unauthorized';
          throw new Error('Bạn cần đăng nhập để truy cập');
        case 403:
          window.location.href = '/Forbidden';
          throw new Error('Bạn không có quyền truy cập');
        case 404: 
          window.location.href = '/NotFound';
          throw new Error('Không tìm thấy tài nguyên');
        default:
          throw new Error(axiosError.response?.data?.message || `Lỗi không xác định: ${statusCode}`);
      }
    }
    throw new Error(axiosError.response?.data?.message || 'Lỗi không xác định');
  }
}

interface BackendErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
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
    const axiosError = error as AxiosError<BackendErrorResponse>;

    if (axiosError.response) {
      const statusCode = axiosError.response.status;
      const errorMessageFromBackend = axiosError.response.data?.message;
      const validationErrors = axiosError.response.data?.errors; 

      switch (statusCode) {
        case 400: 
          const detailedErrorMessage = validationErrors
            ? Object.values(validationErrors).flat().join('; ')
            : errorMessageFromBackend || 'Dữ liệu gửi lên không hợp lệ.';
          throw new Error(detailedErrorMessage);
        case 401:
          throw new Error(errorMessageFromBackend || 'Tên đăng nhập hoặc mật khẩu không đúng.');
        case 403:
          throw new Error(errorMessageFromBackend || 'Bạn không có quyền thực hiện hành động này.');
        case 404: 
          throw new Error(errorMessageFromBackend || 'Không tìm thấy tài nguyên yêu cầu.');
        case 500: 
          throw new Error(errorMessageFromBackend || 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.');
        default:
          throw new Error(errorMessageFromBackend || `Lỗi không xác định: ${statusCode}`);
      }
    } else if (axiosError.request) {
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
    } else {
      throw new Error(axiosError.message || 'Đã xảy ra lỗi không mong muốn.');
    }
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
    if (typeof window !== 'undefined' && axiosError.response?.status) {
        const statusCode = axiosError.response.status;
        switch (statusCode) {
            case 401:
                window.location.href = '/Unauthorized';
                throw new Error('Bạn cần đăng nhập để upload file');
            case 403:
                window.location.href = '/Forbidden';
                throw new Error('Bạn không có quyền upload file');
            case 404: // Endpoint upload file không tồn tại
                window.location.href = '/NotFound';
                throw new Error('Không tìm thấy dịch vụ upload file');
            default:
                throw new Error(axiosError.response?.data?.message || 'Lỗi khi upload file');
        }
    }
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi upload file');
  }
}

// Roles APIs
export async function getAllRoles(): Promise<Roles[]> {
  return apiFetch('/auth/roles', { method: 'GET' });
}

// Get user info
export async function getUserInfo(): Promise<{ userId: string; role: string; username: string }> {
  return apiFetch('/auth/user', { method: 'GET' });
}