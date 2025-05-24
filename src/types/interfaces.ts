
export interface Field {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'select' | 'number' | "file" | "email" | "password";
    placeholder?: string;
    required?: boolean;
    inline?: boolean;
    options?: { value: string; label: string }[];
    readOnly?: boolean | undefined;
    disabled?: boolean;
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

export const LoaiTaiLieuOptions = [
  { value: 1, label: 'Báo cáo' },
  { value: 2, label: 'Biên bản' },
  { value: 3, label: 'Tài liệu' },
  { value: 4, label: 'Họp đoàn' },
];

export interface TaiLieu {
  id: string;
  tenFile: string;
  linkFile: string;
  ngayTao: string;
  loaiTaiLieu: number; 
  keHoachId: string;
  keHoach?: KeHoach;
}

export interface KeHoach {
  id: string;
  tenKeHoach: string;
  userId: string;
  donViId: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  ghiChu?: string;
  slug: string;
  isDeleted: boolean;
  nguoiDung?: NguoiDung;
  donVi?: DonVi;
  taiLieus?: TaiLieu[];
}