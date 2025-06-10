import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlanErrorProps {
  error: string | null;
}

const PlanError: React.FC<PlanErrorProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Lỗi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || 'Không tìm thấy kế hoạch'}</p>
          <Button variant="outline" onClick={() => navigate('/ke-hoach')} className="mt-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanError;