import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type BreadcrumbItem as BreadcrumbItemType, type NavItem } from '@/types';
import { Bell, XCircle } from 'lucide-react';
import PlanManager from './plan-manager';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNotifications } from '@/page/dashboard/hooks/useNotifications';


const rightNavItems: NavItem[] = [
    {
        title: 'Thông báo',
        url: '#',
        icon: Bell,
    },
];

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const {
        notifications,
        loading,
        error,
        unreadCount,
        handleMarkAllAsRead,
        handleDeleteNotification,
        handleNotificationClick,
    } = useNotifications();

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <PlanManager />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center space-x-2">
                <div className="relative flex items-center space-x-1">
                    <div className="hidden lg:flex">
                        {rightNavItems.map((item) => (
                            <TooltipProvider key={item.title} delayDuration={0}>
                                <Tooltip>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="group text-accent-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative"
                                                >
                                                    <span className="sr-only">{item.title}</span>
                                                    {item.icon && <item.icon className="size-5 opacity-80 group-hover:opacity-100" />}
                                                    {unreadCount > 0 && (
                                                        <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center size-4 rounded-full bg-red-500 text-white text-xs font-bold leading-none ring-2 ring-background">
                                                            {unreadCount > 9 ? '9+' : unreadCount}
                                                        </span>
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-80 p-2 max-h-[70vh] overflow-y-auto"
                                            align="end"                                        >
                                            <DropdownMenuLabel className="flex items-center justify-between font-semibold">
                                                <span>Thông báo</span>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {loading ? (
                                                <DropdownMenuItem className="text-center text-muted-foreground" disabled>
                                                    Đang tải thông báo...
                                                </DropdownMenuItem>
                                            ) : error ? (
                                                <DropdownMenuItem className="text-center text-destructive" disabled>
                                                    Lỗi: {error}
                                                </DropdownMenuItem>
                                            ) : notifications.length === 0 ? (
                                                <DropdownMenuItem className="text-center text-muted-foreground" disabled>
                                                    Không có thông báo mới.
                                                </DropdownMenuItem>
                                            ) : (
                                                notifications.map(notification => (
                                                    <DropdownMenuItem
                                                        key={notification.id}
                                                        className={`flex items-start gap-2 p-2 ${!notification.daXem ? 'bg-accent/20 font-medium' : 'text-muted-foreground'}`}
                                                        onClick={() => handleNotificationClick(notification)}
                                                    >
                                                        <div className="flex-1">
                                                            <p className="line-clamp-2">{notification.noiDung}</p>
                                                            {notification.tenKeHoach && (
                                                                <p className="text-xs text-muted-foreground">Kế hoạch: {notification.tenKeHoach}</p>
                                                            )}
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDistanceToNow(notification.ngayTao, { addSuffix: true, locale: vi })}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="ml-auto size-6 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notification.id); }}
                                                        >
                                                            <XCircle className="size-4" />
                                                            <span className="sr-only">Xóa thông báo</span>
                                                        </Button>
                                                    </DropdownMenuItem>
                                                ))
                                            )}
                                            {unreadCount > 0 && notifications.length > 0 && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            onClick={handleMarkAllAsRead}
                                                            className="w-full text-center py-1.5"
                                                        >
                                                            Đánh dấu đã đọc tất cả
                                                        </Button>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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