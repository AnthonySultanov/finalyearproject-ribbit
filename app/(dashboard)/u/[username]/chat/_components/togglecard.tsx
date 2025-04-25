"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {  useTransition } from "react";
import { updatestream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";






type Field = "isChatEnabled" | "isChatDelaymode" | "isChatFollowersOnly";

interface ToggleCardProps {
    field: Field;
    label: string;
    value: boolean;
}


export const ToggleCard = ({field, label, value = false}: ToggleCardProps) => {

    const [isPending, startTransition] = useTransition();

    const onchange = async () => {
        startTransition(() => {
             updatestream({[field]: !value})
             .then(() => {
                toast.success("Stream updated successfully")
             })
             .catch((error) => {
                toast.error("Failed to update stream")
             })
        })
    }




    return (
       <div className="rounded-xl bg-muted p-6">
        <div className="flex items-center justify-between">
            <p className="font-semibold shrink-0">{label}</p>
            <div className="space-y-2">
                <Switch disabled={isPending} checked={value} onCheckedChange={onchange}>
                    {value ? "Enabled" : "Disabled"}
                </Switch>
            </div>
        </div>
        
       </div>
    )
}


export const ToggleCardSkeleton = () => {
    return (
       <Skeleton className="rounded-xl p-10 w-full" />
    )
}
