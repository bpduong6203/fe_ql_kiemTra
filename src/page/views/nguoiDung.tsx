import React from "react";
import AppLayout from "../app-layout";
import type { BreadcrumbItem } from "@/types";
import { useEffect } from "react";
import UserManager from "../dashboard/nguoiDung";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Danh sách người dùng',
        href: '/don_vi',
    },
];

const NguoiDungView: React.FC = () => {

  useEffect(() => {
    document.title = "Danh sách đơn vị - Hệ thống quản lý";
  }, []);    

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <UserManager />
    </AppLayout>
  );
};

export default NguoiDungView;