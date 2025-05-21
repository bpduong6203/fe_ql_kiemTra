const Footer = () => {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-700 py-8 m-4 rounded-4xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột thông tin chung */}
          <div>
            <h3 className="text-lg font-bold">Về chúng tôi</h3>
            <p className="mt-4 text-sm text-gray-400">
              Chúng tôi cam kết mang đến các khóa học chất lượng nhất để bạn nâng cao kỹ năng và xây dựng sự nghiệp tương lai.
            </p>
          </div>

          {/* Cột liên kết nhanh */}
          <div>
            <h3 className="text-lg font-bold">Liên kết nhanh</h3>
            <ul className="mt-4 text-sm space-y-2">
              <li>
                <a href="#" className="hover:underline text-gray-400">Trang chủ</a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-400">Khóa học</a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-400">Giới thiệu</a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-400">Liên hệ</a>
              </li>
            </ul>
          </div>

          {/* Cột liên hệ */}
          <div>
            <h3 className="text-lg font-bold">Liên hệ</h3>
            <ul className="mt-4 text-sm space-y-2">
              <li>
                <span>📍 Địa chỉ: 123 Đường ABC, Quận X, Thành phố Y</span>
              </li>
              <li>
                <span>📞 Hotline: 0900 123 456</span>
              </li>
              <li>
                <span>✉️ Email: support@example.com</span>
              </li>
            </ul>
          </div>

          {/* Cột mạng xã hội */}
          <div>
            <h3 className="text-lg font-bold">Theo dõi chúng tôi</h3>
            <ul className="mt-4 text-sm space-y-2">
              <li>
                <a href="#" className="hover:underline text-gray-400">Facebook</a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-400">Twitter</a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-400">Instagram</a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-400">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          © 2025 Công ty TNHH XYZ. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
