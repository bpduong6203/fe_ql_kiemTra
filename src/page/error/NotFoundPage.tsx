import { useEffect } from 'react';
import ErrorPage from './ErrorPage'; 

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
      imageSrc="/images/404-not-found.svg" 
      imageAlt="404 Not Found Illustration"
      buttonText="Quay về trang chủ"
      buttonLink="/"
    />
  );
}