import React, { useState } from "react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập mã, 3: Đặt lại mật khẩu
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Giả lập gửi email (thay bằng API call thực tế)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep(2);
    } catch {
      setError("Không thể gửi mã xác nhận. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Giả lập xác nhận mã (thay bằng API call thực tế)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (code === "7789BM6X") {
        setStep(3);
      } else {
        setError("Mã xác nhận không đúng!");
      }
    } catch {
      setError("Có lỗi xảy ra khi xác nhận mã!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Giả lập đặt lại mật khẩu (thay bằng API call thực tế)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (password !== confirmPassword) {
        setError("Mật khẩu không khớp!");
        return;
      }
      alert("Mật khẩu đã được đặt lại thành công!");
      onClose();
    } catch {
      setError("Có lỗi xảy ra khi đặt lại mật khẩu!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Quên mật khẩu?</h2>
            <p className="text-gray-600 mb-4">
              Đừng lo, chuyện này ai cũng gặp. Nhập email của bạn để khôi phục mật khẩu.
            </p>
            <form onSubmit={handleSubmitEmail}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Đang gửi..." : "Gửi"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Xác nhận mã</h2>
            <p className="text-gray-600 mb-4">Một mã xác nhận đã được gửi đến email của bạn.</p>
            <form onSubmit={handleSubmitCode}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                  Nhập mã
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <p
                className="text-blue-600 text-sm mb-4 cursor-pointer hover:underline"
                onClick={() => setStep(1)}
              >
                Không nhận được mã? Gửi lại
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Đang xác nhận..." : "Xác nhận"}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h2>
            <p className="text-gray-600 mb-4">
              Mật khẩu cũ của bạn đã được đặt lại. Vui lòng đặt mật khẩu mới.
            </p>
            <form onSubmit={handleSubmitPassword}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Tạo mật khẩu mới
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Nhập lại mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Đang đặt lại..." : "Đặt mật khẩu"}
              </button>
            </form>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;