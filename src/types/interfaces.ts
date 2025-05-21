
export interface Field {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'select' | 'number' | "file" | "email" | "password";
    placeholder?: string;
    required?: boolean;
    inline?: boolean;
    options?: { value: string; label: string }[];
}

export interface DonVi {
    id: string;
    tenDonVi: string;
    diaChi?: string;
    soDienThoai?: string;
    email?: string;
    nguoiDaiDien?: string;
    chucVuNguoiDaiDien?: string;
}


export interface NguoiDung {
    id: string;
    username: string;
    password?: string;
    hoTen?: string;
    email?: string;
    soDienThoai?: string;
    diaChi?: string;
    roleID: string;
    donViID?: string;
    avatar?: string | null;
    role?: Roles;
    donVi?: DonVi;
}

export interface Roles {
    id: string;
    ten: string;
    moTa?: string;
}
