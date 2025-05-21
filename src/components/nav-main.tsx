import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { ChevronRight } from 'lucide-react';

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items = [] }: NavMainProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openItems, setOpenItems] = React.useState<string[]>([]); 
  const toggleSubMenu = (title: string) => {
    console.log('Toggling:', title, openItems); 
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={item.url === currentPath || (item.items && item.items.some((subItem) => subItem.url === currentPath))}
              onClick={(e) => {
                if (item.items) {
                  e.preventDefault(); 
                  toggleSubMenu(item.title);
                }
              }}
            >
              <Link to={item.items ? '#' : item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.items && (
                  <ChevronRight
                    className={`ml-auto transition-transform ${
                      openItems.includes(item.title) ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </Link>
            </SidebarMenuButton>
            {item.items && openItems.includes(item.title) && (
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild isActive={subItem.url === currentPath}>
                      <Link to={subItem.url}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}