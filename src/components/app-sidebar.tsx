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
} from 'lucide-react';
import AppLogo from './app-logo';
import { Link } from 'react-router-dom';

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
    url: '#',
    icon: UserPlus,
  },
  {
    title: 'Kiểm tra',
    url: '#',
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}