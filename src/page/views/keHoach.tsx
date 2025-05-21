import React from "react";
import KeHoach from "../dashboard/keHoach"; 
import AppLayout from "../app-layout";
import type { BreadcrumbItem } from "@/types";
import { useEffect } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tạo Kế Hoạch',
        href: '/ke_hoach',
    },
];

const KeHoachView: React.FC = () => {

  useEffect(() => {
    document.title = "Tạo kế hoạch - Hệ thống quản lý";
  }, []);    

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <KeHoach />
    </AppLayout>
  );
};

export default KeHoachView;