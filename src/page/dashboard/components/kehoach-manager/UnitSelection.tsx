import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Unit {
  id: string;
  name: string;
}

interface UnitSelectionProps {
  units: Unit[];
  loading: boolean;
  selectedUnit: string | null;
  setSelectedUnit: React.Dispatch<React.SetStateAction<string | null>>;
  error?: string | null; 
}

const UnitSelection: React.FC<UnitSelectionProps> = ({ units, loading, selectedUnit, setSelectedUnit, error }) => {
  const handleUnitChange = (unitId: string) => {
    setSelectedUnit((prev) => (prev === unitId ? null : unitId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn Đơn Vị</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            {units.map((unit) => (
              <div key={unit.id} className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id={unit.id}
                  checked={selectedUnit === unit.id}
                  onCheckedChange={() => handleUnitChange(unit.id)}
                />
                <Label htmlFor={unit.id}>{unit.name}</Label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnitSelection;