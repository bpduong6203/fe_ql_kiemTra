import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon, SearchIcon } from "lucide-react";
import GenericModal from "@/components/generic-modal";

interface Plan {
  id: string;
  name: string;
  createdAt: string;
}

const PlanManager: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Giả lập lấy danh sách kế hoạch
  useEffect(() => {
    setTimeout(() => {
      const mockPlans: Plan[] = [
        { id: "1", name: "Kế hoạch A", createdAt: "2025-05-01" },
        { id: "2", name: "Kế hoạch B", createdAt: "2025-05-10" },
        { id: "3", name: "Kế hoạch C", createdAt: "2025-05-15" },
      ];
      setPlans(mockPlans);
      setFilteredPlans(mockPlans);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc kế hoạch theo thanh tìm kiếm
  useEffect(() => {
    const filtered = plans.filter((plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlans(filtered);
  }, [searchQuery, plans]);

  // Xử lý chọn kế hoạch
  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setOpen(false); 
  };

  // Không cần hàm onSave vì không lưu dữ liệu form
  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="size-4" />
        {selectedPlan ? selectedPlan.name : "Quản lý kế hoạch"}
      </Button>

      <GenericModal
        isOpen={open}
        onClose={handleClose}
        title="Quản lý kế hoạch"
        fields={[]} 
        apiEndpoint="" 
        onSave={async () => {}} 
      >
        <div className="space-y-4">
          {/* Thanh tìm kiếm */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm kế hoạch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Danh sách kế hoạch */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-2 p-1">
                  <div className="h-6 bg-neutral-100 rounded" />
                  <div className="h-6 bg-neutral-100 rounded" />
                  <div className="h-6 bg-neutral-100 rounded" />
                </div>
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
                      <div>
                        <p className="font-medium">{plan.name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </GenericModal>
    </>
  );
};

export default PlanManager;