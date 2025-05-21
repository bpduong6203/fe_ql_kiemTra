import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type NguoiDung } from '@/types/interfaces';

export function UserInfo({ user, showEmail = false }: { user: NguoiDung; showEmail?: boolean }) {
    const getInitials = useInitials();
    const imgBaseUrl = import.meta.env.VITE_IMG_URL || import.meta.env.VITE_API_BASE_URL;

    const displayName = user.hoTen && typeof user.hoTen === 'string' ? user.hoTen : 'Unknown';

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage
                    src={user.avatar ? `${imgBaseUrl}${user.avatar}` : ''}
                    alt={displayName}
                />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(displayName)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span> 
                {showEmail && (
                    <span className="text-muted-foreground truncate text-xs">
                        {user.email || 'No email'}
                    </span>
                )}
            </div>
        </>
    );
}


