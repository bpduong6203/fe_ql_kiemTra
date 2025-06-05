import { cn } from '@/lib/utils';

export default function Heading({ title, description, className }: { title: string; description?: string; className?: string }) {
    return (
        <div className={cn("mb-8 space-y-0.5 text-center md:mb-10", className)}>
            <h2 className="text-xl md:text-1xl lg:text-2xl font-semibold tracking-tight"> 
                {title}
            </h2>
            {description && <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">{description}</p>}
        </div>
    );
}