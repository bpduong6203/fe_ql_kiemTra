import { useEffect } from 'react';
import ErrorPage from './ErrorPage'; 

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
      imageSrc="http://googleusercontent.com/image_generation_content/0" 
      imageAlt="401 Unauthorized Illustration"
      buttonText="Đăng nhập ngay"
      buttonLink="/login" 
    />
  );
}