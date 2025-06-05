import { apiFetch } from "./api";

export type GiaiTrinhFilePayload = {
    giaiTrinhID: string;
    tenFile: string;
    linkFile: string;
};

export async function createGiaiTrinhFile(data: GiaiTrinhFilePayload): Promise<{
    id: string;
    giaiTrinhID: string;
    linkFile: string;
    tenFile: string;
    ngayTao: string;
}> {
    return apiFetch('/GiaiTrinhFile', { method: 'POST', data });
}

export async function deleteGiaiTrinhFile(id: string): Promise<{ message: string }> {
    return apiFetch(`/GiaiTrinhFile/${id}`, { method: 'DELETE' });
}

export async function getGiaiTrinhFile(id: string): Promise<{
    id: string;
    giaiTrinhID: string;
    linkFile: string;
    tenFile: string;
    ngayTao: string;
}> {
    return apiFetch(`/GiaiTrinhFile/${id}`, { method: 'GET' });
}