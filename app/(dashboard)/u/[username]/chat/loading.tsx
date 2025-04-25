import { ToggleCardSkeleton } from "./_components/togglecard";
import { Skeleton } from "@/components/ui/skeleton";




const loadingthechat = () =>{
    return (
        <div className="space-y-4 p-6">
            <Skeleton className="h-10 w-[200px]" />
            <div className="space-y-4">
                <ToggleCardSkeleton />
                <ToggleCardSkeleton />
                <ToggleCardSkeleton />
            </div>
        </div>
    );
};

export default loadingthechat;

