import { useEffect } from 'react';
import ErrorPage from './ErrorPage';

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
      imageSrc="http://googleusercontent.com/image_generation_content/1" 
      imageAlt="403 Forbidden Illustration"
      buttonText="Quay về trang chủ"
      buttonLink="/"
    />
  );
}