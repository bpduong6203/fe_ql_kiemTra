// src/context/SelectedPlanContext.tsx (tạo file này)
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

interface Plan {
  id: string;
  name: string;
  createdAt: string;
}

interface SelectedPlanContextType {
  selectedPlan: Plan | null;
  setSelectedPlanGlobally: (plan: Plan | null) => void;
}

const SelectedPlanContext = createContext<SelectedPlanContextType | undefined>(undefined);

export const SelectedPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlan, setSelectedPlanState] = useState<Plan | null>(() => {
    // Khôi phục từ localStorage khi khởi tạo
    const storedPlan = localStorage.getItem('selectedPlan');
    return storedPlan ? JSON.parse(storedPlan) : null;
  });

  const setSelectedPlanGlobally = useCallback((plan: Plan | null) => {
    setSelectedPlanState(plan);
    if (plan) {
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
    } else {
      localStorage.removeItem('selectedPlan');
    }
    // Gửi một sự kiện tùy chỉnh nếu cần để các component khác trong cùng tab có thể phản ứng ngay
    // Tuy nhiên, việc cập nhật state trong context đã đủ để trigger re-render
  }, []);

  // Sync state với localStorage nếu state thay đổi từ bên ngoài (ít khả năng)
  // và để đảm bảo dữ liệu persistent
  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    } else {
      localStorage.removeItem('selectedPlan');
    }
  }, [selectedPlan]);


  return (
    <SelectedPlanContext.Provider value={{ selectedPlan, setSelectedPlanGlobally }}>
      {children}
    </SelectedPlanContext.Provider>
  );
};

export const useSelectedPlan = () => {
  const context = useContext(SelectedPlanContext);
  if (context === undefined) {
    throw new Error('useSelectedPlan must be used within a SelectedPlanProvider');
  }
  return context;
};