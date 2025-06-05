
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

export interface PhanCongUser {
  id: string;
  keHoachID: string;
  userID: string;
  linkFile: string;
  noiDungCV: string;
  ngayTao: string; 
  nguoiDung: {
    username: string;
    hoTen: string;
  };
  keHoach: {
    tenKeHoach: string;
  };
}

export interface CurrentUserApiInfo {
  userId: string;
  role: string;
  username?: string;
  hoTen?: string;    
  email?: string;    
  soDienThoai?: string;
  diaChi?: string;   
}

export interface GiaiTrinhFile {
  id: string;
  giaiTrinhID: string;
  linkFile: string;
  tenFile: string;
  ngayTao: string;
}

export interface NguoiDungSelectedInfo {
  username: string;
  hoTen: string;
  id?: string;
}

export interface KeHoachSelectedInfo {
  tenKeHoach: string;
}

export interface GiaiTrinh {
  id: string;
  keHoachID: string;
  nguoiYeuCauID: string;
  nguoiGiaiTrinhID: string;
  ngayTao: string;
  trangThaiTongThe: string;
  nguoiYeuCau: NguoiDungSelectedInfo;
  nguoiGiaiTrinh: NguoiDungSelectedInfo;
  keHoach: KeHoachSelectedInfo;
  giaiTrinhFiles: GiaiTrinhFile[]; 
}

export interface NDGiaiTrinh {
  id: string;
  giaiTrinhID: string;
  noiDung?: string; 
  tenFile?: string; 
  linkFile?: string;
  ngayTao: string;
  daXem: boolean;
  trangThai: string;
  nguoiDanhGiaID?: string; 
  ngayDanhGia?: string; 
  nguoiDanhGia?: NguoiDungSelectedInfo; 
}

export interface NDGiaiTrinhPayload {
  giaiTrinhID: string;
  noiDung?: string;
  tenFile?: string;
  linkFile?: string;
  nguoiDanhGiaID?: string;
}

export interface DanhGiaNDGiaiTrinhPayload {
  trangThai: 'Đạt' | 'Chưa Đạt'; 
}
