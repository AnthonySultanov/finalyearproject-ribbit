import { cn } from "@/lib/utils";


interface LiveDotBadgeProps {
    className?: string;
};


export const LiveDotBadge = ({ className, }: LiveDotBadgeProps) => {
    return (
        <div className={cn("bg-red-500 text-center p-0.5 px-1.5 rounded-md uppercase text-[10px] border border-background font-semibold tracking-wide", className)}>
            Live
        </div>
    );
}











