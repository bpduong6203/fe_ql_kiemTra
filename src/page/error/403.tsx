import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between">
        {/* Left side with title and text */}
        <div className="md:w-1/2 text-left mb-8 md:mb-0 px-[10%]">
            <h1 className="text-5xl font-bold text-gray-800 mb-2">Ooops....</h1>
            <p className="text-xl text-gray-700 mb-4">Page not found</p>
            <p className="text-base text-gray-600 mb-8 max-w-md">
              Rất tiếc! Bạn không có quyền truy cập vào trang<br />
              này. Hãy kiểm tra lại hoặc liên hệ quản trị viên.
            </p>
            <Link
              to="/"
              className="inline-block bg-[oklch(0.86_0.18_88.9)] hover:bg-[oklch(0.86_0.18_78.9)] text-black px-8 py-3 rounded-md font-medium transition duration-300"
            >
              Quay về
            </Link>
          </div>

          {/* Right side with image */}
          <div className="md:w-1/2 flex justify-center px-[2%]">
            <div className="relative w-full h-full">
              <img
                src="/5229770.jpg"
                alt="403 Forbidden"
                width={600}
                height={500}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
  );
}