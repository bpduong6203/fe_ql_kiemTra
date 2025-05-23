import type { DonVi } from "@/types/interfaces";
import { apiFetch } from "./api";

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

export async function restoreDonVi(id: string): Promise<{ message: string }> {
  return apiFetch(`/donvi/restore/${id}`, { method: 'PATCH' });
}

export async function getDeletedDonVis(): Promise<DonVi[]> {
  return apiFetch('/donvi/deleted', { method: 'GET' });
}