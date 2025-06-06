import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { fetchApiNoToken } from '@/lib/api';
import type { LoginResponse, LoginError } from '@/types/auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/loading-spinner';
import { useAuth } from '@/context/AuthContext';

const LoginForm = ({ onSubmit }: { onSubmit?: (username: string, password: string) => void }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchApiNoToken<LoginResponse>('/auth/login', {
        method: 'POST',
        data: { Username: username, Password: password },
        headers: {
          'Content-Type': 'application/json',
          'X-Remember-Me': rememberMe ? 'true' : 'false',
        },
      });

      localStorage.setItem('user', JSON.stringify(data.user));
      await checkAuth();
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
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              className="mr-2"
            />
            <Label htmlFor="remember-me">Ghi nhớ tôi</Label>
          </div>

          <Link
            to="/auth/forgotpassword"
            className="text-blue-600 dark:text-blue-500 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <LoadingSpinner variant={2}/>
            <span>Đang xử lý</span>
          </>
        ) : (
          'Đăng nhập'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;