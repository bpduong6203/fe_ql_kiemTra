import { useState, useRef, useEffect } from 'react';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/toast-provider';
import { updatePassword as updatePasswordAPI, getUserInfo } from '@/lib/apiuser';
import type { NguoiDung } from '@/types/interfaces';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

type PasswordForm = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export default function Password() {
    const { addToast } = useToast();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<PasswordForm>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Partial<PasswordForm>>({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userInfo: NguoiDung = await getUserInfo();
                setCurrentUserId(userInfo.id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
                addToast('Không thể tải thông tin người dùng để cập nhật mật khẩu.', 'error');
            }
        };
        fetchUserId();
    }, [addToast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof PasswordForm]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmitPasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (!formData.current_password) {
            setErrors(prev => ({ ...prev, current_password: 'Mật khẩu hiện tại không được để trống.' }));
            setProcessing(false); return;
        }
        if (!formData.password) {
            setErrors(prev => ({ ...prev, password: 'Mật khẩu mới không được để trống.' }));
            setProcessing(false); return;
        }
        if (!formData.password_confirmation) {
            setErrors(prev => ({ ...prev, password_confirmation: 'Xác nhận mật khẩu không được để trống.' }));
            setProcessing(false); return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setErrors(prev => ({ ...prev, password: 'Mật khẩu phải dài ít nhất 8 ký tự, chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt (!@#$%^&*).' }));
            setProcessing(false); return;
        }

        if (formData.password !== formData.password_confirmation) {
            setErrors(prev => ({ ...prev, password_confirmation: 'Mật khẩu mới và xác nhận mật khẩu không khớp.' }));
            setProcessing(false); return;
        }

        try {
            const response = await updatePasswordAPI({
                current_password: formData.current_password,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            addToast(response.message || 'Cập nhật mật khẩu thành công!', 'success');
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);

            setFormData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
            currentPasswordInput.current?.focus(); 

        } catch (err: any) {
            console.error('Lỗi khi cập nhật mật khẩu:', err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                if (err.response.data.errors.password) {
                    passwordInput.current?.focus();
                } else if (err.response.data.errors.current_password) {
                    currentPasswordInput.current?.focus();
                }
            } else {
                addToast(err.message || 'Đã xảy ra lỗi khi cập nhật mật khẩu.', 'error');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Cập nhật mật khẩu" description="Đảm bảo tài khoản của bạn sử dụng mật khẩu dài, ngẫu nhiên để an toàn" />

                    <form onSubmit={handleSubmitPasswordUpdate} className="space-y-6"> {/* Thay đổi ở đây */}
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">Mật khẩu hiện tại</Label>
                            <Input
                                id="current_password"
                                name="current_password"
                                ref={currentPasswordInput}
                                value={formData.current_password}
                                onChange={handleChange}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Mật khẩu hiện tại"
                            />
                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Mật khẩu mới</Label>
                            <Input
                                id="password"
                                name="password"
                                ref={passwordInput}
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Mật khẩu mới"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Xác nhận mật khẩu"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Lưu mật khẩu</Button>

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