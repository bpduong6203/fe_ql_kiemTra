import { apiFetch } from "./api";
import type { NDGiaiTrinh, NDGiaiTrinhPayload, DanhGiaNDGiaiTrinhPayload } from "@/types/interfaces"; // Đảm bảo import đúng

export async function getNDGiaiTrinh(id: string): Promise<NDGiaiTrinh> {
    const response = await apiFetch<NDGiaiTrinh>(`/NDGiaiTrinh/${id}`, { method: 'GET' });
    return response;
}

export async function getNDGiaiTrinhsByGiaiTrinhId(giaiTrinhId: string): Promise<NDGiaiTrinh[]> {
    const response = await apiFetch<NDGiaiTrinh[]>(`/NDGiaiTrinh/byGiaiTrinh/${giaiTrinhId}`, { method: 'GET' });
    return response;
}

export async function createNDGiaiTrinh(data: NDGiaiTrinhPayload): Promise<NDGiaiTrinh> {
    const response = await apiFetch<NDGiaiTrinh>('/NDGiaiTrinh', { method: 'POST', data });
    return response;
}

export async function updateNDGiaiTrinh(id: string, data: NDGiaiTrinhPayload): Promise<void> {
    await apiFetch(`/NDGiaiTrinh/${id}`, { method: 'PUT', data });
}

export async function deleteNDGiaiTrinh(id: string): Promise<{ message: string }> {
    return apiFetch(`/NDGiaiTrinh/${id}`, { method: 'DELETE' });
}

export async function danhGiaNDGiaiTrinh(id: string, data: DanhGiaNDGiaiTrinhPayload): Promise<void> {
    await apiFetch(`/NDGiaiTrinh/${id}/DanhGia`, { method: 'PUT', data });
}