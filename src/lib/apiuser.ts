import type { NguoiDung } from "@/types/interfaces";
import { apiFetch } from "./api";

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

export async function restoreUser(id: string): Promise<{ message: string }> {
  return apiFetch(`/auth/users/restore/${id}`, { method: 'PATCH' });
}

export async function getUserInfo(): Promise<NguoiDung> {
  const response = await apiFetch<NguoiDung>('/auth/profile', { method: 'GET' });
  return response; 
}

export async function updatePassword(
  data: { current_password: string; password: string; password_confirmation: string }
): Promise<{ message: string }> {
  return apiFetch(`/auth/change-password`, { method: 'PATCH', data });
}