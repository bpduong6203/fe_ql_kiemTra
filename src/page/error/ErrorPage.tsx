import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ErrorPageProps {
  statusCode: 401 | 403 | 404 | 500 | string;
  title: string;
  message: string;
  description?: string;
  customImageRenderer: React.ReactNode; 
  buttonText: string;
  buttonLink: string;
  showCode?: boolean;
}

export default function ErrorPage({
  statusCode,
  title,
  message,
  description,
  buttonText,
  customImageRenderer, 
  buttonLink,
  showCode = true,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-foreground">
      <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          {showCode && (
            <h1 className="text-6xl md:text-8xl font-extrabold text-blue-600 dark:text-blue-400 mb-4 animate-fade-in-up">
              {statusCode}
            </h1>
          )}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2 animate-fade-in-up delay-100">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 animate-fade-in-up delay-200">
            {message}
          </p>
          {description && (
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto md:mx-0 animate-fade-in-up delay-300">
              {description}
            </p>
          )}
          <Link
            to={buttonLink}
            className={cn(
              'inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-400',
            )}
          >
            {buttonText}
          </Link>
        </div>

        <div className="md:w-1/2 flex justify-center px-4 md:px-0">
          <div className="relative w-full max-w-md h-auto">
            <div className="w-full h-auto object-contain rounded-lg">
              {customImageRenderer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}