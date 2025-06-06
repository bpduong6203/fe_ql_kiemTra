import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface DashboardFeatureCardProps {
  title: string;
  icon: React.ElementType;
  description: string;
  to: string;
}

const DashboardFeatureCard = ({ title, icon: Icon, description, to }: DashboardFeatureCardProps) => (
  <Card className="flex flex-col items-start p-4 md:p-6 text-left hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="p-0 mb-3 md:mb-4">
      <div className="p-2 md:p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-2 md:mb-3">
        <Icon className="size-6 md:size-7" />
      </div>
      <CardTitle className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0 flex-grow">
      <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-4">{description}</p>
    </CardContent>
    <Button asChild variant="link" className="px-0 text-blue-600 dark:text-blue-300 hover:no-underline text-sm md:text-base">
      <Link to={to} className="inline-flex items-center">
        Xem chi tiết <ArrowRight className="ml-1 size-3 md:size-4" />
      </Link>
    </Button>
  </Card>
);

export default DashboardFeatureCard;