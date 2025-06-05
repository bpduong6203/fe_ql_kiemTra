import { useState, useEffect } from 'react';
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
import { useToast } from '@/components/toast-provider';

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Notification {
    id: string;
    message: string;
    read: boolean;
    timestamp: string;
    link?: string;
}

const rightNavItems: NavItem[] = [
    {
        title: 'Thông báo',
        url: '#',
        icon: Bell,
    },
];

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { addToast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const mockFetchNotifications = () => {
            const mockData: Notification[] = [
                { id: '1', message: 'Kế hoạch "Kiểm toán Q2" đã được duyệt.', read: false, timestamp: '2025-06-03T10:00:00Z', link: '/ke_hoach/123' },
                { id: '2', message: 'Bạn có một yêu cầu giải trình mới từ Nguyễn Văn A.', read: false, timestamp: '2025-06-03T09:30:00Z', link: '/giai_trinh/456' },
                { id: '3', message: 'Báo cáo "Doanh thu tháng 5" đã hoàn thành.', read: true, timestamp: '2025-06-02T16:00:00Z' },
                { id: '4', message: 'Đơn vị ABC đã cập nhật thông tin.', read: false, timestamp: '2025-06-01T14:15:00Z', link: '/don_vi/789' },
            ];
            setNotifications(mockData);
        };
        mockFetchNotifications();
    }, []);

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
        addToast('Đã đánh dấu là đã đọc', 'info');
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        addToast('Đã đánh dấu tất cả là đã đọc', 'success');
    };

    const handleDeleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        addToast('Đã xóa thông báo', 'info');
    };

    const handleNotificationClick = (notification: Notification) => {
        handleMarkAsRead(notification.id);
        if (notification.link) {
            window.location.href = notification.link;
        }
    };

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
                                        <DropdownMenuContent className="w-80 p-2" align="end">
                                            <DropdownMenuLabel className="flex items-center justify-between font-semibold">
                                                <span>Thông báo</span>
                                                {/* Nút "Đánh dấu đã đọc tất cả" ĐÃ ĐƯỢC CHUYỂN XUỐNG DƯỚI */}
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {notifications.length === 0 ? (
                                                <DropdownMenuItem className="text-center text-muted-foreground" disabled>
                                                    Không có thông báo mới.
                                                </DropdownMenuItem>
                                            ) : (
                                                notifications.map(notification => (
                                                    <DropdownMenuItem
                                                        key={notification.id}
                                                        className={`flex items-start gap-2 p-2 ${!notification.read ? 'bg-accent/20 font-medium' : 'text-muted-foreground'}`}
                                                        onClick={() => handleNotificationClick(notification)}
                                                    >
                                                        <div className="flex-1">
                                                            <p className="line-clamp-2">{notification.message}</p>
                                                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: vi })}</span>
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