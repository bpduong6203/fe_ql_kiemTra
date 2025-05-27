import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Link } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { type NguoiDung } from '@/types/interfaces';
import { useAuth } from '@/context/AuthContext';

interface UserMenuContentProps {
  user: NguoiDung;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' }); 
      localStorage.removeItem('user'); 
      await checkAuth();
      cleanup();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link className="block w-full" to="/settings/profile" onClick={cleanup}>
            <Settings className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <button className="flex items-center w-full" onClick={handleLogout}>
          <LogOut className="mr-2" />
          Đăng xuất
        </button>
      </DropdownMenuItem>
    </>
  );
}


