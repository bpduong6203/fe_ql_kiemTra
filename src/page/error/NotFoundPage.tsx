import { useEffect } from 'react';
import ErrorPage from './ErrorPage';
import Lottie from 'lottie-react';
import animationData from '@/assets/Animation - 1749115178013.json'; 

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 - Không tìm thấy trang';
  }, []);

  return (
    <ErrorPage
      statusCode="404"
      title="Ooops...."
      message="Không tìm thấy trang."
      description="Rất tiếc, trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên, hoặc không bao giờ tồn tại. Vui lòng kiểm tra lại đường dẫn."
      customImageRenderer={
        <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
          />
        </div>
      }
      buttonText="Quay về trang chủ"
      buttonLink="/"
    />
  );
}