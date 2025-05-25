// src/components/PlanManager.tsx
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import { PlusIcon, SearchIcon } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { useKeHoach } from '@/page/dashboard/hooks/useKeHoach';
import LoadingSpinner from '@/components/loading-spinner';
import { useToast } from '@/components/toast-provider';
import { useSelectedPlan } from '@/context/SelectedPlanContext'; // Import context

interface Plan {
  id: string;
  name: string;
  createdAt: string;
}

const PlanManager: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  
  // Sử dụng context để get và set selectedPlan
  const { selectedPlan, setSelectedPlanGlobally } = useSelectedPlan(); 
  
  const { keHoachList, loading, fetchKeHoachs } = useKeHoach();
  const { addToast } = useToast();

  // Lấy danh sách kế hoạch từ API
  useEffect(() => {
    const loadPlans = async () => {
      try {
        await fetchKeHoachs();
      } catch (error) {
        addToast('Lỗi khi lấy danh sách kế hoạch', 'error');
      }
    };
    loadPlans();
  }, [fetchKeHoachs, addToast]);

  // Ánh xạ keHoachList sang Plan và chọn kế hoạch đầu tiên nếu chưa có
  useEffect(() => {
    const mappedPlans: Plan[] = keHoachList
      .filter((keHoach) => !keHoach.isDeleted)
      .map((keHoach) => ({
        id: keHoach.id,
        name: keHoach.tenKeHoach,
        createdAt: keHoach.ngayBatDau,
      }));
    setPlans(mappedPlans);
    setFilteredPlans(mappedPlans);

    // Nếu chưa có selectedPlan trong context, chọn kế hoạch đầu tiên
    if (!selectedPlan && mappedPlans.length > 0) {
      const firstPlan = mappedPlans[0];
      setSelectedPlanGlobally(firstPlan); // Cập nhật qua context
    }
  }, [keHoachList, selectedPlan, setSelectedPlanGlobally]); // Thêm setSelectedPlanGlobally vào dependency

  // Lọc kế hoạch theo thanh tìm kiếm
  useEffect(() => {
    const filtered = plans.filter((plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlans(filtered);
  }, [searchQuery, plans]);

  // Xử lý chọn kế hoạch
  const handleSelectPlan = useCallback((plan: Plan) => {
    setSelectedPlanGlobally(plan); // Cập nhật qua context
    setOpen(false);
  }, [setSelectedPlanGlobally]); // Thêm setSelectedPlanGlobally vào dependency

  // Đóng sheet
  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchQuery('');
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusIcon className="size-4" />
          {selectedPlan ? selectedPlan.name : 'Quản lý kế hoạch'}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Quản lý kế hoạch</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {/* Thanh tìm kiếm */}
          <div className="relative mr-2 ml-2">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm kế hoạch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Danh sách kế hoạch */}
          <CardContent className="p-0">
            {loading ? (
              <>
                <div className="space-y-2 p-1">
                  <div className="h-6 bg-neutral-100 rounded" />
                  <div className="h-6 bg-neutral-100 rounded" />
                  <div className="h-6 bg-neutral-100 rounded" />
                </div>
                <LoadingSpinner variant={2} withOverlay={false} />
              </>
            ) : filteredPlans.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Không tìm thấy kế hoạch.</p>
            ) : (
              <ul className="divide-y divide-neutral-200">
                {filteredPlans.map((plan) => (
                  <li
                    key={plan.id}
                    className="pl-4 p-1 flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <div className="flex justify-between w-full p-1">
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(plan.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </div>
        <SheetClose className="sr-only" onClick={handleClose} />
      </SheetContent>
    </Sheet>
  );
};

export default PlanManager;