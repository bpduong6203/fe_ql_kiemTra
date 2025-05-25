import React from "react";
import AppLayout from "../app-layout";
import type { BreadcrumbItem } from "@/types";
import { useEffect } from "react";
import KeHoachDetail from "../dashboard/KeHoachDetail";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chi tiết kế hoạch',
        href: '/chi_tiet_ke_hoach',
    },
];

const KeHoachDetails: React.FC = () => {

  useEffect(() => {
    document.title = "Chi tiết kế hoạch - Hệ thống quản lý";
  }, []);    

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <KeHoachDetail />
    </AppLayout>
  );
};

export default KeHoachDetails;