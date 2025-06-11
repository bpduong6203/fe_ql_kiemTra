import React from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import {
  BookOpen,
  CheckCircle,
  ClipboardList,
  Folder,
  LayoutGrid,
  UserPlus,
  Users,
  Building,
  LogIn,
  Eye,
  ClipboardEdit,
} from 'lucide-react';
import AppLogo from './app-logo';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useUser } from '@/page/dashboard/hooks/useUser';

const allNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutGrid,
    roles: ['TruongDoan', 'ThanhVien', 'DonVi'],
  },
  {
    title: 'Lập kế hoạch',
    url: '/ke_hoach',
    icon: ClipboardEdit,
    roles: ['TruongDoan', 'ThanhVien'],
  },
  {
    title: 'Xem kế hoạch',
    url: '/chi_tiet_ke_hoach',
    icon: Eye,
    roles: ['TruongDoan', 'ThanhVien', 'DonVi'],
  },
  {
    title: 'Phân công',
    url: '/phan_cong',
    icon: UserPlus,
    roles: ['TruongDoan'],
  },
  {
    title: 'Giải trình',
    url: '/giai_trinh',
    icon: ClipboardList,
    roles: ['TruongDoan', 'ThanhVien', 'DonVi'],
  },
  {
    title: 'Kết luận',
    url: '#',
    icon: CheckCircle,
    roles: ['TruongDoan'],
  },
  {
    title: 'Người dùng',
    url: '/nguoi_dung',
    icon: Users,
    roles: ['TruongDoan', 'ThanhVien'],
  },
  {
    title: 'Đơn vị',
    url: '/don_vi',
    icon: Building,
    roles: ['TruongDoan', 'ThanhVien'],
  },
];

const footerNavItems: NavItem[] = [
  {
    title: 'Repository',
    url: '#',
    icon: Folder,
  },
  {
    title: 'Khoá học',
    url: '#',
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const { isLoggedIn } = useAuth(); 
  const { userRole, loading: userLoading } = useUser(); 
  const { setOpen, state, isMobile } = useSidebar();

  const handleLoginClick = () => {
    if (!isMobile && state === 'collapsed') {
      setOpen(true);
    }
  };

  const filteredMainNavItems = React.useMemo(() => {
    if (!userRole || userLoading) { 
      return [];
    }
    return allNavItems.filter(item => item.roles && item.roles.includes(userRole));
  }, [userRole, userLoading]);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {userLoading ? (
          <div className="p-4 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-10/12"></div>
            <div className="h-6 bg-gray-200 rounded w-11/12"></div>
          </div>
        ) : (
          <NavMain items={filteredMainNavItems} />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        {isLoggedIn ? (
          <NavUser />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="bg-destructive text-white hover:text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                asChild
                tooltip="Đăng nhập"
                onClick={handleLoginClick}
              >
                <Link to="/login" className="flex items-center w-full gap-2">
                  <LogIn className="ml-2 size-5 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Đăng nhập
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}