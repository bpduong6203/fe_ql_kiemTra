import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { useDashboardData } from '@/page/dashboard/hooks/useDashboardData';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
const BAR_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const ProjectOverviewSection = () => {
  const {
    loading,
    error,
    projectStatusData,
    taskCompletionData,
    totalProjects,
    completedProjects,
    pendingGiaiTrinhs,
  } = useDashboardData();

  if (loading) {
    return (
      <section className="py-2 md:py-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <Heading title="Tổng Quan Dự Án" description="Đang tải dữ liệu tổng quan..." className="mb-8 md:mb-10" />
          <div className="text-center py-10">Đang tải dữ liệu biểu đồ...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-2 md:py-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <Heading title="Tổng Quan Dự Án" description="Có lỗi xảy ra khi tải dữ liệu." className="mb-8 md:mb-10" />
          <div className="text-center py-10 text-red-500">Lỗi: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 md:py-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <Heading
          title="Tổng Quan Dự Án"
          description="Cái nhìn tổng thể về trạng thái và tiến độ các dự án hiện tại."
          className="mb-8 md:mb-10"
        />

        {/* Các số liệu KPI nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{totalProjects}</p>
                <p className="text-sm text-muted-foreground">Tổng số kế hoạch</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{completedProjects}</p>
                <p className="text-sm text-muted-foreground">Kế hoạch đã hoàn thành</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{pendingGiaiTrinhs}</p>
                <p className="text-sm text-muted-foreground">Giải trình đang chờ</p>
            </Card>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Chart 1: Project Status - Biểu đồ hình tròn */}
          <Card className="p-4 md:p-6">
            <CardHeader className="p-0 mb-3 md:mb-4">
              <HeadingSmall
                title="Trạng Thái Dự Án"
                description="Biểu đồ tổng quan về tình trạng các dự án."
              />
            </CardHeader>
            <CardContent className="p-0 mt-3 md:mt-4">
              {projectStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectStatusData.map(( _, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 md:h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg text-muted-foreground text-sm md:text-base">
                  Không có dữ liệu trạng thái dự án.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chart 2: Task Completion - Biểu đồ cột */}
          <Card className="p-4 md:p-6">
            <CardHeader className="p-0 mb-3 md:mb-4">
              <HeadingSmall
                title="Tiến Độ Hoàn Thành Công Việc"
                description="Biểu đồ theo dõi tiến độ các công việc đã hoàn thành."
              />
            </CardHeader>
            <CardContent className="p-0 mt-3 md:mt-4">
              {taskCompletionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={taskCompletionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Số lượng" >
                        {taskCompletionData.map(( _, index) => (
                            <Cell key={`bar-cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 md:h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg text-muted-foreground text-sm md:text-base">
                  Không có dữ liệu tiến độ công việc.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverviewSection;