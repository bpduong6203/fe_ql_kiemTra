import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { apiFetch } from '@/lib/api';
import type { LoginResponse, LoginError } from '@/types/auth';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const LoginForm = ({ onSubmit }: { onSubmit?: (username: string, password: string) => void }) => {
    const [username, setUsername] = useState<string>(''); // Đổi từ email thành username
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await apiFetch<LoginResponse>('/auth/login', {
                method: 'POST',
                data: { Username: username, Password: password }, // Dùng Username, Password theo API
                headers: {
                    'Content-Type': 'application/json',
                    // Gửi rememberMe để server điều chỉnh cookie (tùy chọn)
                    'X-Remember-Me': rememberMe ? 'true' : 'false',
                },
            });

            // Lưu thông tin user vào localStorage (không lưu token vì dùng cookie)
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/');

            if (onSubmit) {
                onSubmit(username, password);
            }
        } catch (err) {
            setError((err as LoginError).message || 'Đã xảy ra lỗi khi đăng nhập');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <InputError message={error} />}

            <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tài khoản"
            />

            <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
            />

            <div className="mt-6 text-center p-2">
                <div className="flex justify-between items-center text-sm text-gray-700">
                    <div className="flex items-center">
                        <Checkbox
                            id="remember-me"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(!!checked)}
                            className="mr-2"
                        />
                        <Label htmlFor="remember-me">Ghi nhớ tôi</Label>
                    </div>

                    <Link to="/auth/forgotpassword" className="text-blue-600 hover:underline">
                        Quên mật khẩu?
                    </Link>
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
        </form>
    );
};

export default LoginForm;

