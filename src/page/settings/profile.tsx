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
import { updateMyProfile, getUserInfo } from '@/lib/apiuser';
import type { UpdateProfilePayload } from '@/types/interfaces'; 

type ProfileProps = {};

type ProfileForm = {
    id: string;
    username: string;
    hoTen: string;
    email: string;
    soDienThoai?: string;
    diaChi?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cài đặt hồ sơ',
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
    });
    const [errors, setErrors] = useState<Partial<ProfileForm>>({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await getUserInfo();

                setFormData({
                    id: userInfo.id,
                    username: userInfo.username,
                    hoTen: userInfo.hoTen || '',
                    email: userInfo.email || '',
                    soDienThoai: userInfo.soDienThoai || '',
                    diaChi: userInfo.diaChi || '',
                });
            } catch (err) {
                console.error('Lỗi khi tải thông tin người dùng.', err);
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

        const payload: UpdateProfilePayload = { 
            hoTen: formData.hoTen,
            email: formData.email,
            soDienThoai: formData.soDienThoai,
            diaChi: formData.diaChi,
        };

        const filteredPayload: UpdateProfilePayload = {}; 
        for (const key in payload) {
            if (payload[key as keyof typeof payload] !== undefined && payload[key as keyof typeof payload] !== null) {
                if (key === 'email' && typeof payload[key] === 'string' && payload[key] === '') {
                    filteredPayload[key as keyof typeof payload] = payload[key as keyof typeof payload];
                } else if (payload[key as keyof typeof payload] !== '') { 
                    filteredPayload[key as keyof typeof payload] = payload[key as keyof typeof payload];
                }
            }
        }

        try {
            const response = await updateMyProfile(filteredPayload);

            addToast(response.message || 'Cập nhật hồ sơ thành công!', 'success');
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);

        } catch (err: any) {
            console.error('Lỗi khi cập nhật hồ sơ:', err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                addToast(err.message || 'Lỗi khi cập nhật hồ sơ.', 'error');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Thông tin cá nhân"
                        description="Cập nhật tên, email và các thông tin khác của bạn"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Tên đăng nhập</Label>
                            <Input
                                id="username"
                                name="username"
                                className="mt-1 block w-full"
                                value={formData.username}
                                readOnly
                                disabled
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