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
  Calendar,
  CheckCircle,
  ClipboardList,
  Folder,
  HelpCircle,
  LayoutGrid,
  UserPlus,
  Users,
  Building,
  LogIn,
} from 'lucide-react';
import AppLogo from './app-logo';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '#',
    icon: LayoutGrid,
  },
  {
    title: 'Kế hoạch',
    url: '#',
    icon: Calendar,
    items: [
      { title: 'Lập kế hoạch', url: '/ke_hoach' },
      { title: 'Xem kế hoạch', url: '/chi_tiet_ke_hoach' },
    ],
  },
  {
    title: 'Phân công',
    url: '/phan_cong',
    icon: UserPlus,
  },
  {
    title: 'Giải trình',
    url: '/giai_trinh',
    icon: ClipboardList,
  },
  {
    title: 'Kết luận',
    url: '#',
    icon: CheckCircle,
  },
  {
    title: 'Câu hỏi',
    url: '#',
    icon: HelpCircle,
  },
  {
    title: 'Người dùng',
    url: '/nguoi_dung',
    icon: Users,
  },
  {
    title: 'Đơn vị',
    url: '/don_vi',
    icon: Building,
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
  const { setOpen, state, isMobile } = useSidebar();

  const handleLoginClick = () => {
    if (!isMobile && state === 'collapsed') {
      setOpen(true); 
    }
  };

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
        <NavMain items={mainNavItems} />
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