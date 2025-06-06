import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ProjectOverviewSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900"> 
      <div className="container mx-auto px-4 md:px-6">
        <Heading
          title="Tổng Quan Dự Án"
          description="Cái nhìn tổng thể về trạng thái và tiến độ các dự án hiện tại."
          className="mb-8 md:mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Chart 1: Project Status */}
          <Card className="p-4 md:p-6">
            <CardHeader className="p-0 mb-3 md:mb-4">
              <HeadingSmall
                title="Trạng Thái Dự Án"
                description="Biểu đồ tổng quan về tình trạng các dự án."
              />
            </CardHeader>
            <CardContent className="p-0 mt-3 md:mt-4">
              <div className="h-40 md:h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg text-muted-foreground text-sm md:text-base">
                Biểu đồ trạng thái dự án (sẽ được tích hợp sau)
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Task Completion */}
          <Card className="p-4 md:p-6">
            <CardHeader className="p-0 mb-3 md:mb-4">
              <HeadingSmall
                title="Tiến Độ Hoàn Thành Công Việc"
                description="Biểu đồ theo dõi tiến độ các công việc đã hoàn thành."
              />
            </CardHeader>
            <CardContent className="p-0 mt-3 md:mt-4">
              <div className="h-40 md:h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg text-muted-foreground text-sm md:text-base">
                Biểu đồ tiến độ công việc (sẽ được tích hợp sau)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverviewSection;