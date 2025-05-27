import { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronsUpDown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import type { Auth } from '@/types/index';
import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/lib/api';

export function NavUser() {
    const [auth, setAuth] = useState<Auth>({
        user: { id: '', username: '', hoTen: '', email: '', avatar: null, roleID: '', donViID: '' },
    });
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    useEffect(() => {
        getUserInfo()
            .then((userData) => {
                setAuth({
                    user: {
                        id: userData.userId,
                        username: userData.role, 
                        roleID: userData.role,
                    },
                });
                setIsLoggedIn(true);
            })
            .catch(() => {
                setIsLoggedIn(false); 
                setAuth({
                    user: { id: '', username: '', hoTen: '', email: '', avatar: null, roleID: '', donViID: '' },
                });
            });
    }, [navigate]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {isLoggedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size="lg" className="text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group">
                                <UserInfo user={auth.user} />
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            align="end"
                            side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                        >
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link to="/login">
                        <Button size="lg" className="w-full" variant={'outline'}>
                            Đăng nhập
                        </Button>
                    </Link>
                )}
            </SidebarMenuItem>
        </SidebarMenu>
    );
}