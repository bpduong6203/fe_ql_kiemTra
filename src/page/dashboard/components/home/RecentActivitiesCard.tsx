import HeadingSmall from '@/components/heading-small';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const RecentActivitiesCard = () => {
  return (
    <div className="mt-12 md:mt-16">
      <Card className="p-4 md:p-6">
        <CardHeader className="p-0 mb-3 md:mb-4">
          <HeadingSmall
            title="Hoạt Động Gần Đây"
            description="Các cập nhật và sự kiện mới nhất trong dự án."
            className="items-center gap-2"
          />
        </CardHeader>
        <CardContent className="p-0 mt-3 md:mt-4">
          <ul className="space-y-2 md:space-y-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
            <li className="flex items-center gap-2">
              <span className="size-2 bg-blue-500 rounded-full flex-shrink-0"></span> Dự án "Ứng dụng di động" đã được cập nhật.
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 bg-emerald-500 rounded-full flex-shrink-0"></span> Bạn đã hoàn thành 3 công việc trong tuần này.
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 bg-yellow-500 rounded-full flex-shrink-0"></span> Báo cáo tháng 5 đã sẵn sàng.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivitiesCard;