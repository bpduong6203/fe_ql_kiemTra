import { useEffect } from 'react';
import AppLayout from '../../layouts/app-layout';
import HeroSection from './components/home/HeroSection';
import MainFeaturesSection from './components/home/MainFeaturesSection';
import ProjectOverviewSection from './components/home/ProjectOverviewSection';
import RecentActivitiesCard from './components/home/RecentActivitiesCard';
import { Link } from 'react-router-dom';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Dashboard - Quản Lý Dự Án & Công Việc';
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background text-foreground">
        <HeroSection />
        <MainFeaturesSection />
        <ProjectOverviewSection /> 
        <div className="container mx-auto px-4 md:px-6"> 
          <RecentActivitiesCard />
        </div>

        {/* Footer - Consistent and modern look */}
        <footer className="bg-gray-800 text-white py-8 md:py-10 dark:bg-gray-950 mt-4">
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

export default HomePage;