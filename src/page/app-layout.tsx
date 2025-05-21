import AppLayoutTemplate from './app-sidebar-layout';
import { type ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/index';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const AppLayout = ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);

export default AppLayout;