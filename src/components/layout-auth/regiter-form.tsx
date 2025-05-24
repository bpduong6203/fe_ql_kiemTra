import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchApiNoToken } from '@/lib/api';
import type { RegisterResponse, LoginError } from '@/types/auth';
import LoadingSpinner from '../loading-spinner';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

const RegisterForm = ({ onSubmit }: { onSubmit?: (email: string, password: string) => void }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [hoTen, setHoTen] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validatePassword = (pwd: string): string | null => {
    if (!pwd || pwd.length <= 8) {
      return 'Mật khẩu phải dài hơn 8 ký tự';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Mật khẩu phải có ít nhất một chữ hoa';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Mật khẩu phải có ít nhất một chữ thường';
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return 'Mật khẩu phải có ít nhất một ký tự đặc biệt';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Kiểm tra mật khẩu client-side
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      setIsLoading(false);
      return;
    }

    console.log('Sending request:', { username, email, hoTen, password }); 

    try {
      const data = await fetchApiNoToken<RegisterResponse>('/auth/register', {
        method: 'POST',
        data: {
          Username: username,
          Email: email,
          HoTen: hoTen,
          Password: password,
        },
      });

      console.log('Register successful:', data);

      // Chỉ lưu user vào localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');

      if (onSubmit) {
        onSubmit(email, password);
      }
    } catch (err) {
      console.error('Error response:', err); 
      const error = err as LoginError;
      const message = error.message || 'Đã xảy ra lỗi khi đăng ký';
      const newErrors: FormErrors = {};

      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        if (serverErrors.Username) newErrors.username = serverErrors.Username[0];
        if (serverErrors.Email) newErrors.email = serverErrors.Email[0];
        if (serverErrors.Password) newErrors.password = serverErrors.Password[0];
      } else if (message.includes('Username already exists')) {
        newErrors.username = 'Tên đăng nhập đã tồn tại';
      } else if (message.includes('Email already exists')) {
        newErrors.email = 'Email đã tồn tại';
      } else if (message.includes('Password must be')) {
        newErrors.password = message;
      } else {
        newErrors.general = message;
      }
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {errors.general && (
        <Alert variant="destructive">
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <div>
        <Input
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên đăng nhập"
          className="w-full"
        />
        {errors.username && <InputError message={errors.username} />}
      </div>

      <div>
        <Input
          id="hoTen"
          name="hoTen"
          type="text"
          required
          value={hoTen}
          onChange={(e) => setHoTen(e.target.value)}
          placeholder="Họ và tên"
          className="w-full"
        />
      </div>

      <div>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full"
        />
        {errors.email && <InputError message={errors.email} />}
      </div>

      <div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className="w-full"
        />
        {errors.password && <InputError message={errors.password} />}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <LoadingSpinner variant={2}/>
            <span>Đang xử lý</span>
          </>
        ) : (
          'Đăng ký'
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;