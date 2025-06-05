import { apiFetch } from "./api";
import type { GiaiTrinh } from "@/types/interfaces";

export type GiaiTrinhPayload = {
    keHoachID: string;
    nguoiGiaiTrinhID: string;
    trangThaiTongThe?: string;
};

export async function getGiaiTrinhs(): Promise<GiaiTrinh[]> {
    return apiFetch('/GiaiTrinh', { method: 'GET' });
}

export async function getGiaiTrinh(id: string): Promise<GiaiTrinh> {
    return apiFetch(`/GiaiTrinh/${id}`, { method: 'GET' });
}

export async function createGiaiTrinh(data: GiaiTrinhPayload): Promise<{ 
    id: string; 
    keHoachID: string; 
    nguoiYeuCauID: string; 
    nguoiGiaiTrinhID: string; 
    ngayTao: string; 
    trangThaiTongThe: string; 
}> {
    return apiFetch('/GiaiTrinh', { method: 'POST', data });
}

export async function updateGiaiTrinh(id: string, data: GiaiTrinhPayload): Promise<void> {
    await apiFetch(`/GiaiTrinh/${id}`, { method: 'PUT', data });
}

export async function deleteGiaiTrinh(id: string): Promise<{ message: string }> {
    return apiFetch(`/GiaiTrinh/${id}`, { method: 'DELETE' });
}