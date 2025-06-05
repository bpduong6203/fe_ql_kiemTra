import { useEffect } from 'react';
import ErrorPage from './ErrorPage';
import Lottie from 'lottie-react';
import animationData from '@/assets/Animation - 1749115178013.json'; 

export default function ForbiddenPage() {
  useEffect(() => {
    document.title = '403 - Quyền truy cập bị từ chối';
  }, []);

  return (
    <ErrorPage
      statusCode="403"
      title="Quyền truy cập bị từ chối!"
      message="Bạn không có quyền truy cập trang này."
      description="Tài khoản của bạn không có đủ quyền để xem nội dung này hoặc thực hiện hành động này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi."
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