import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppLayout from '../../layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  ClipboardList,
  CheckCircle,
  HelpCircle,
  Users,
  Building,
  UserPlus,
  ArrowRight,
  BarChart2,
} from 'lucide-react';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Dashboard - Quản Lý Dự Án & Công Việc';
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-800 text-white py-12 md:py-20 lg:py-28">
          <div className="container mx-auto px-4 md:px-6 text-center z-10 relative">
            <h1 className="text-1xl md:text-3xl lg:text-4xl font-extrabold mb-3 md:mb-4 animate-fade-in-up"> 
              Chào Mừng Đến Với Dashboard Của Bạn!
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-6 md:mb-8 animate-fade-in-up delay-100"> 
              Quản lý dự án, phân công và giải trình một cách thông minh, hiệu quả.
            </p>
            <Link
              to="/ke_hoach"
              className={cn(
                'inline-flex items-center px-6 py-2 md:px-8 md:py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-200',
              )}
            >
              Bắt Đầu Ngay <ArrowRight className="ml-2 size-4 md:size-5" /> 
            </Link>
          </div>
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="w-full h-full" fill="none" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50%" cy="0" r="300" fill="currentColor" className="text-blue-500" />
              <circle cx="20%" cy="80%" r="200" fill="currentColor" className="text-indigo-500" />
              <circle cx="80%" cy="40%" r="250" fill="currentColor" className="text-blue-400" />
            </svg>
          </div>
        </section>

        {/* Dashboard Content - Structured with Cards */}
        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6"> 
            <Heading title="Các Chức Năng Chính" description="Khám phá các tính năng cốt lõi giúp bạn quản lý công việc hiệu quả." className="mb-8 md:mb-10" />

            {/* Quick Navigation / Dashboard Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16"> 
              <DashboardFeatureCard
                title="Quản Lý Kế Hoạch"
                icon={Calendar}
                description="Lập kế hoạch, theo dõi và quản lý các dự án của bạn một cách hiệu quả."
                to="/ke_hoach"
              />
              <DashboardFeatureCard
                title="Phân Công Công Việc"
                icon={UserPlus}
                description="Phân công nhiệm vụ, theo dõi tiến độ của từng thành viên trong nhóm."
                to="/phan_cong"
              />
              <DashboardFeatureCard
                title="Giải Trình"
                icon={ClipboardList}
                description="Quản lý và theo dõi các yêu cầu giải trình, đảm bảo minh bạch."
                to="/giai_trinh"
              />
              <DashboardFeatureCard
                title="Tổng Quan Kết Luận"
                icon={CheckCircle}
                description="Xem các kết luận quan trọng, báo cáo và đánh giá tổng thể dự án."
                to="#"
              />
              <DashboardFeatureCard
                title="Hệ Thống Câu Hỏi"
                icon={HelpCircle}
                description="Tìm kiếm câu trả lời cho các thắc mắc thường gặp và hỗ trợ nhanh chóng."
                to="#"
              />
              <DashboardFeatureCard
                title="Quản Lý Người Dùng"
                icon={Users}
                description="Quản lý thông tin tài khoản, vai trò và quyền hạn của người dùng."
                to="/nguoi_dung"
              />
              <DashboardFeatureCard
                title="Quản Lý Đơn Vị"
                icon={Building}
                description="Tổ chức và quản lý thông tin các đơn vị liên quan đến dự án."
                to="/don_vi"
              />
               <DashboardFeatureCard
                title="Báo Cáo & Thống Kê"
                icon={BarChart2}
                description="Xem báo cáo chi tiết và thống kê trực quan về hiệu suất dự án."
                to="#"
              />
            </div>

            <Heading title="Tổng Quan Dự Án" description="Cái nhìn tổng thể về trạng thái và tiến độ các dự án hiện tại." className="mb-8 md:mb-10" /> 

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"> 
              {/* Chart 1: Project Status */}
              <Card className="p-4 md:p-6">
                <CardHeader className="p-0 mb-3 md:mb-4">
                  <HeadingSmall title="Trạng Thái Dự Án" description="Biểu đồ tổng quan về tình trạng các dự án."/>
                </CardHeader>
                <CardContent className="p-0 mt-3 md:mt-4"> 
                  <div className="h-40 md:h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg text-muted-foreground text-sm md:text-base">
                    Biểu đồ trạng thái dự án (sẽ được tích hợp sau)
                  </div>
                </CardContent>
              </Card>

              {/* Chart 2: Task Completion */}
              <Card className="p-4 md:p-6"> 
                <CardHeader className="p-0 mb-3 md:mb-4"> 
                  <HeadingSmall title="Tiến Độ Hoàn Thành Công Việc" description="Biểu đồ theo dõi tiến độ các công việc đã hoàn thành."/>
                </CardHeader>
                <CardContent className="p-0 mt-3 md:mt-4"> 
                  <div className="h-40 md:h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg text-muted-foreground text-sm md:text-base"> 
                    Biểu đồ tiến độ công việc (sẽ được tích hợp sau)
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="mt-12 md:mt-16"> 
              <Card className="p-4 md:p-6"> 
                <CardHeader className="p-0 mb-3 md:mb-4"> 
                  <HeadingSmall title="Hoạt Động Gần Đây" description="Các cập nhật và sự kiện mới nhất trong dự án." className="items-center gap-2" />
                </CardHeader>
                <CardContent className="p-0 mt-3 md:mt-4">
                  <ul className="space-y-2 md:space-y-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    <li className="flex items-center gap-2">
                      <span className="size-2 bg-blue-500 rounded-full flex-shrink-0"></span> Dự án "Ứng dụng di động" đã được cập nhật.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-2 bg-emerald-500 rounded-full flex-shrink-0"></span> Bạn đã hoàn thành 3 công việc trong tuần này.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-2 bg-yellow-500 rounded-full flex-shrink-0"></span> Báo cáo tháng 5 đã sẵn sàng.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer - Consistent and modern look */}
        <footer className="bg-gray-800 text-white py-8 md:py-10 dark:bg-gray-950">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <p className="mb-3 md:mb-4 text-gray-400 text-sm md:text-base">&copy; 2025 Tên Ứng Dụng. All rights reserved.</p>
            <div className="flex justify-center gap-4 md:gap-6 text-gray-300 text-sm md:text-base">
              <Link to="/about" className="hover:text-white transition-colors">
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

interface DashboardFeatureCardProps {
  title: string;
  icon: React.ElementType;
  description: string;
  to: string;
}

const DashboardFeatureCard = ({ title, icon: Icon, description, to }: DashboardFeatureCardProps) => (
  <Card className="flex flex-col items-start p-4 md:p-6 text-left hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="p-0 mb-3 md:mb-4">
      <div className="p-2 md:p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-2 md:mb-3"> 
        <Icon className="size-6 md:size-7" /> 
      </div>
      <CardTitle className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0 flex-grow">
      <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-4">{description}</p> 
    </CardContent>
    <Button asChild variant="link" className="px-0 text-blue-600 dark:text-blue-300 hover:no-underline text-sm md:text-base">
      <Link to={to} className="inline-flex items-center">
        Xem chi tiết <ArrowRight className="ml-1 size-3 md:size-4" />
      </Link>
    </Button>
  </Card>
);

export default HomePage;