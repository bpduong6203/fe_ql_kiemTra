import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type BreadcrumbItem as BreadcrumbItemType, type NavItem } from '@/types';
import DarkModeToggle from './dark-mode-toggle';
import { Bell, ShoppingBag } from 'lucide-react';
import PlanManager from './plan-manager';

const rightNavItems: NavItem[] = [
    {
      title: 'Giỏ hàng',
      url: '#',
      icon: ShoppingBag,
    },
    {
      title: 'Thông báo',
      url: '#',
      icon: Bell,
    },
  ];

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 justify-between">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <PlanManager />
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex items-center space-x-2">
            <div className="relative flex items-center space-x-1">
                <DarkModeToggle />
                <div className="hidden lg:flex">
                    {rightNavItems.map((item) => (
                        <TooltipProvider key={item.title} delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <a
                                        href={item.url}
                                        rel="noopener noreferrer"
                                        className="group text-accent-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <span className="sr-only">{item.title}</span>
                                        {item.icon && <item.icon className="size-5 opacity-80 group-hover:opacity-100" />}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>
        </div>
    </header>
    );
}
