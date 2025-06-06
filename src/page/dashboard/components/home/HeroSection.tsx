import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';
import animationData from '@/assets/Animation - 1749178158674.json'; 

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-800 text-white py-12 md:py-20 lg:py-28">
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
        {/* Thay thế SVG bằng Lottie Component */}
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </section>
  );
};

export default HeroSection;