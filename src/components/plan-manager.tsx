// src/components/PlanManager.tsx
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import { PlusIcon, SearchIcon, Trash2 } from 'lucide-react';
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
import { useSelectedPlan } from '@/context/SelectedPlanContext';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useLocation, matchPath } from 'react-router-dom';

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

  const { selectedPlan, setSelectedPlanGlobally } = useSelectedPlan();
  const { keHoachList, loading, fetchKeHoachs } = useKeHoach();
  const { addToast } = useToast();

  const location = useLocation();

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

    let planToSelect: Plan | null = null; 

    const match = matchPath('/ke_hoach/:keHoachId/*', location.pathname);
    const keHoachIdFromUrl = match?.params?.keHoachId as string | undefined;

    if (keHoachIdFromUrl) {
      planToSelect = mappedPlans.find(p => p.id === keHoachIdFromUrl) || null;
      if (planToSelect) {
        if (!selectedPlan || selectedPlan.id !== planToSelect.id) {
          setSelectedPlanGlobally(planToSelect);
        }
        return;
      }
    }

    if (!selectedPlan && mappedPlans.length > 0) {
      planToSelect = mappedPlans[0];
      setSelectedPlanGlobally(planToSelect);
    }
  }, [keHoachList, selectedPlan, setSelectedPlanGlobally, location.pathname]);

  useEffect(() => {
    const filtered = plans.filter((plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlans(filtered);
  }, [searchQuery, plans]);

  const handleSelectPlan = useCallback((plan: Plan) => {
    setSelectedPlanGlobally(plan);
    setOpen(false);
  }, [setSelectedPlanGlobally]);

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
          <div className="flex relative mr-2 ml-2">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm kế hoạch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 mr-3"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <a href='/danh_sach_ke_hoach'>
                <Button variant="destructive" size="icon">
                  <Trash2 className="size-4" />
                </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Danh sách kế hoạch
              </TooltipContent>
            </Tooltip>
          </div>

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