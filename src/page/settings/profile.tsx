import { useState, useEffect, type FormEventHandler } from 'react';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useToast } from '@/components/toast-provider';
import { updateUser, getUserInfo } from '@/lib/apiuser';
import type { NguoiDung } from '@/types/interfaces';

type ProfileProps = {};

type ProfileForm = {
    id: string;
    username: string; 
    hoTen: string;
    email: string;
    soDienThoai?: string;
    diaChi?: string;
    roleID?: string;
    donViID?: string;
    password?: string; 
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile', 
    },
];

export default function Profile({}: ProfileProps) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState<ProfileForm>({
        id: '',
        username: '',
        hoTen: '',
        email: '',
        soDienThoai: '',
        diaChi: '',
        roleID: '', 
        donViID: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<ProfileForm>>({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo: NguoiDung = await getUserInfo();

                setFormData({
                    id: userInfo.id,
                    username: userInfo.username,
                    hoTen: userInfo.hoTen || '',
                    email: userInfo.email || '',
                    soDienThoai: userInfo.soDienThoai || '',
                    diaChi: userInfo.diaChi || '',
                    roleID: userInfo.roleID,
                    donViID: userInfo.donViID, 
                });
            } catch (err) {
                console.error('Error fetching user info:', err);
                addToast('Lỗi khi tải thông tin người dùng.', 'error');
            }
        };

        fetchUserData();
    }, [addToast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof ProfileForm]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const submit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({}); 

        if (!formData.id) {
            addToast('Không tìm thấy ID người dùng để cập nhật.', 'error');
            setProcessing(false);
            return;
        }

        const payload: Partial<NguoiDung> = {
            username: formData.username, 
            hoTen: formData.hoTen,
            email: formData.email,
            soDienThoai: formData.soDienThoai,
            diaChi: formData.diaChi,
            roleID: formData.roleID, 
            donViID: formData.donViID, 
            password: formData.password, 
        };

        try {
            const response = await updateUser(formData.id, payload); 

            addToast(response.message || 'Cập nhật profile thành công!', 'success');
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);

        } catch (err: any) {
            console.error('Error updating profile:', err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                addToast(err.message || 'Lỗi khi cập nhật profile.', 'error');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Thông tin cá nhân" description="Cập nhật tên, email và các thông tin khác của bạn" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Tên đăng nhập</Label>
                            <Input
                                id="username"
                                name="username"
                                className="mt-1 block w-full"
                                value={formData.username}
                                onChange={handleChange} 
                                required
                                readOnly 
                                placeholder="Tên đăng nhập"
                            />
                            <InputError className="mt-2" message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hoTen">Họ và Tên</Label>
                            <Input
                                id="hoTen"
                                name="hoTen"
                                className="mt-1 block w-full"
                                value={formData.hoTen || ''}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                placeholder="Họ và Tên"
                            />
                            <InputError className="mt-2" message={errors.hoTen} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={formData.email || ''}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                                placeholder="Địa chỉ Email"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="soDienThoai">Số điện thoại</Label>
                            <Input
                                id="soDienThoai"
                                name="soDienThoai"
                                type="tel"
                                className="mt-1 block w-full"
                                value={formData.soDienThoai || ''}
                                onChange={handleChange}
                                placeholder="Số điện thoại"
                            />
                            <InputError className="mt-2" message={errors.soDienThoai} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="diaChi">Địa chỉ</Label>
                            <Input
                                id="diaChi"
                                name="diaChi"
                                className="mt-1 block w-full"
                                value={formData.diaChi || ''}
                                onChange={handleChange}
                                placeholder="Địa chỉ"
                            />
                            <InputError className="mt-2" message={errors.diaChi} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Lưu</Button>

                            {recentlySuccessful && (
                                <p className="text-sm text-green-600">Đã lưu!</p>
                            )}
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}