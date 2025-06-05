import VideoBackground from "@/components/layout-auth/video-background";
import RegisterForm from "@/components/layout-auth/regiter-form";
import Heading from "@/components/heading";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  useEffect(() => {
    document.title = "Đăng Ký - Hệ thống quản lý";
  }, []);

  const handleLogin = () => {
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center relative">
        <VideoBackground />
        <div className="w-full p-5 h-full flex items-center justify-center">
          <div className="w-full max-w-md py-8 px-10 flex flex-col justify-center backdrop-filter backdrop-blur-md bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-lg">
            <div className="text-center">
              <Heading
                title="Đăng Ký"
                description="Vui lòng nhập các thông tin bên dưới"
              />
            </div>
            <RegisterForm onSubmit={handleLogin} />
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-xs text-gray-500 dark:text-neutral-100">Hoặc</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm ">
                Bạn chưa có tài khoản?{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-500 hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;