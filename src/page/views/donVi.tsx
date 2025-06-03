import React from "react";
import AppLayout from "../../layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { useEffect } from "react";
import DonViPage from "../dashboard/donVi";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Danh sách đơn vị',
        href: '/don_vi',
    },
];

const DonVIView: React.FC = () => {

  useEffect(() => {
    document.title = "Danh sách đơn vị - Hệ thống quản lý";
  }, []);    

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <DonViPage />
    </AppLayout>
  );
};

export default DonVIView;