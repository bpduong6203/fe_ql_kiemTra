import type { LucideIcon } from 'lucide-react';
import type { NguoiDung } from '@/types/interfaces';

export interface Auth {
    user: NguoiDung;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
    roles?: string[]; 
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    apiBaseUrl: string;

    [key: string]: unknown;
}

