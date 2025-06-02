import React from "react";
import AppLayout from "../app-layout";
import type { BreadcrumbItem } from "@/types";
import { useEffect } from "react";
import PhanCongPage from "../dashboard/PhanCongPage";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Phân công kế hoạch',
        href: '/phan_cong',
    },
];

const PhanCong: React.FC = () => {

  useEffect(() => {
    document.title = "Phân công kế hoạch - Hệ thống quản lý";
  }, []);    

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PhanCongPage />
    </AppLayout>
  );
};

export default PhanCong;