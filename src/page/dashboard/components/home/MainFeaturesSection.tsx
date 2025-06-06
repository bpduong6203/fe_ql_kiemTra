import Heading from '@/components/heading';
import DashboardFeatureCard from './DashboardFeatureCard';
import {
  Calendar,
  ClipboardList,
  CheckCircle,
  HelpCircle,
  Users,
  Building,
  UserPlus,
  BarChart2,
} from 'lucide-react';

const MainFeaturesSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <Heading
          title="Các Chức Năng Chính"
          description="Khám phá các tính năng cốt lõi giúp bạn quản lý công việc hiệu quả."
          className="mb-8 md:mb-10"
        />

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
      </div>
    </section>
  );
};

export default MainFeaturesSection;