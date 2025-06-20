import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Hồ sơ',
        url: '/settings/profile',
        icon: null,
    },
    {
        title: 'Mật khẩu', 
        url: '/settings/password',
        icon: null,
    },
    {
        title: 'Giao diện',
        url: '/settings/appearance',
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading
                title="Cài đặt" 
                description="Quản lý hồ sơ và cài đặt tài khoản của bạn" 
            />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.url}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.url,
                                })}
                            >
                                <Link to={item.url}>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}