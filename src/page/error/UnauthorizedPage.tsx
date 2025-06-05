import { useEffect } from 'react';
import ErrorPage from './ErrorPage'; 
import Lottie from 'lottie-react'; 
import animationData from '@/assets/Animation - 1749115178013.json'; 

export default function UnauthorizedPage() {
  useEffect(() => {
    document.title = '401 - Không được ủy quyền';
  }, []);

  return (
    <ErrorPage
      statusCode="401"
      title="Yêu cầu xác thực!"
      message="Bạn cần đăng nhập để truy cập trang này."
      description="Phiên làm việc của bạn có thể đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại để tiếp tục."
      customImageRenderer={
        <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
          />
        </div>
      }
      buttonText="Đăng nhập ngay"
      buttonLink="/login" 
    />
  );
}