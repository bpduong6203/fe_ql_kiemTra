// src/page/HomePage.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppLayout from '../app-layout';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Trang Chủ - Tên Dashboard';
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Keep a concise welcome */}
        <section className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Chào Mừng Đến Với Tên Dashboard
            </h1>
            <p className="text-lg md:text-xl">
              Tổng quan dự án và công việc của bạn
            </p>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Quick Navigation / Dashboard Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
              {/* Added dashboard navigation */}
              <DashboardCard
                title="Kế hoạch"
                icon="📝" 
                to="/chi_tiet_ke_hoach"
              />
              <DashboardCard
                title="Phân công"
                icon="🧑‍💻"
                to="#"
              />
              <DashboardCard
                title="Kiểm tra"
                icon="✅"
                to="#"
              />
              <DashboardCard
                title="Kết luận"
                icon="📊"
                to="#"
              />
              <DashboardCard
                title="Câu hỏi"
                icon="❓"
                to="/#"
              />
              <DashboardCard
                title="Người dùng"
                icon="👥"
                to="//nguoi_dung"
              />
              <DashboardCard
                title="Đơn vị"
                icon="🏢"
                to="/don_vi"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng Quan Dự Án</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chart 1: Project Status */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Trạng Thái Dự Án</h3>
              </div>

              {/* Chart 2: Task Completion */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Tiến Độ Hoàn Thành Công Việc</h3>
              </div>

              {/* Add more charts/widgets as needed */}
            </div>

            {/* Placeholder for recent activities or quick stats */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Hoạt Động Gần Đây</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Dự án "Ứng dụng di động" đã được cập nhật.</li>
                <li>Bạn đã hoàn thành 3 công việc trong tuần này.</li>
                <li>Báo cáo tháng 5 đã sẵn sàng.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action Section - Can be integrated into dashboard or kept if relevant */}
        <section className="bg-gray-100 py-12 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bạn Muốn Bắt Đầu Một Dự Án Mới?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Quản lý dự án của bạn một cách hiệu quả ngay hôm nay!
            </p>
            <Link
              to="/dashboard/new-project" // Link to a new project creation page
              className={cn(
                'inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700',
              )}
            >
              Tạo Dự Án Mới
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

// A simple reusable card component for dashboard navigation
interface DashboardCardProps {
  title: string;
  icon: string; // Consider using an icon library like react-icons for better icons
  to: string;
}

const DashboardCard = ({ title, icon, to }: DashboardCardProps) => (
  <Link
    to={to}
    className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-200"
  >
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
  </Link>
);

export default HomePage;