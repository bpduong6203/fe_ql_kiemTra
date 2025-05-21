// src/page/HomePage.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppLayout from '../app-layout';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Trang Chủ - Tên Ứng Dụng';
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chào Mừng Đến Với Tên Ứng Dụng
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Khám phá các tính năng tuyệt vời và bắt đầu hành trình của bạn ngay hôm nay!
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/auth/login"
                className={cn(
                  'inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100',
                )}
              >
                Đăng Nhập
              </Link>
              <Link
                to="/auth/register"
                className={cn(
                  'inline-block px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg shadow hover:bg-blue-900',
                )}
              >
                Đăng Ký
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Tính Năng Nổi Bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-blue-600 text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Nhanh Chóng</h3>
                <p className="text-gray-600">
                  Trải nghiệm tốc độ vượt trội với công nghệ hiện đại.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-blue-600 text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Bảo Mật</h3>
                <p className="text-gray-600">
                  Dữ liệu của bạn được bảo vệ an toàn tuyệt đối.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-blue-600 text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold mb-2">Kết Nối</h3>
                <p className="text-gray-600">
                  Kết nối dễ dàng với cộng đồng và dịch vụ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Sẵn Sàng Bắt Đầu?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Tham gia ngay để trải nghiệm những tính năng độc đáo của chúng tôi!
            </p>
            <Link
              to="/auth/register"
              className={cn(
                'inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700',
              )}
            >
              Tham Gia Ngay
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-4">&copy; 2025 Tên Ứng Dụng. All rights reserved.</p>
            <div className="flex justify-center gap-4">
              <Link to="/about" className="hover:underline">
                Về Chúng Tôi
              </Link>
              <Link to="/contact" className="hover:underline">
                Liên Hệ
              </Link>
              <Link to="/privacy" className="hover:underline">
                Chính Sách Bảo Mật
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </AppLayout>

  );
};

export default HomePage;