import {cva,type VariantProps} from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { LiveDotBadge } from "./LiveDotBadge";


const UserPFSizes = cva(
    //this is where i can add custom sizes to the userpf
    "",
    {
        variants: {
            size: {
                default: "h-8 w-8",
                lg: "h-14 w-14"
            },
        },
        defaultVariants: {
            size: "default",
        },
    },
);



interface UserPFProps extends VariantProps<typeof UserPFSizes> {
    imageUrl: string;
    username: string;
    isLive?: boolean;
    showLiveDot?: boolean;
};





export const UserPF = ({ username,imageUrl,isLive,showLiveDot,size }: UserPFProps) => {
    const canshowLiveDot = showLiveDot && isLive;

    return (
       <div className="relative">
        <Avatar className={cn(isLive && "ring-2 ring-red-600 border border-background", UserPFSizes({size}))}>
            <AvatarImage src={imageUrl} className="object-cover" />
            <AvatarFallback>
                {username[0]}
                {username[username.length - 1]}
            </AvatarFallback>
        </Avatar>
        {canshowLiveDot && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2" >
                <LiveDotBadge />
            </div>
        )}
       </div>
    );
}


interface UserIconSkeletonProps extends VariantProps<typeof UserPFSizes> {};

export const UserIconSkeleton = ({ size }: UserIconSkeletonProps) => {
    return (
        <Skeleton className={cn( "rounded-full",UserPFSizes({size}),)} />
    );
};
