import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoPlanSelected: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Chưa chọn kế hoạch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Vui lòng chọn một kế hoạch từ Plan Manager.</p>
          <Button variant="outline" onClick={() => navigate('/ke-hoach')} className="mt-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoPlanSelected;