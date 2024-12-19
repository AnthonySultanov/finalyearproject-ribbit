"use client";

import { Button } from "@/components/ui/button";
import { useEnableSidebar } from "@/storing/enable-sidebar";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import  {Hinting} from "@/components/hinting";

export const Toggle = () => {

const { onExpand, onCollapse,collapsed } = useEnableSidebar((state) => state);

const label = collapsed ? "Expand" : "Collapse";


    return (
        <>
            {collapsed && (
                <div className="hidden lg:flex w-full items-center justify-center pt-4 mb-4">
                    <Hinting label={label} side="right" asChild>
                   <Button variant="ghost" className="h-auto p-2" onClick={onExpand}>
                    <ArrowRightFromLine className="h-4 w-4" />
                   </Button>
                   </Hinting>
                </div>
            )}


            {!collapsed && ( 
                <div className="p-2 pl-5 mb-2 flex items-center w-full">
                    <p className="font-bold text-primary text-green-100">
                    Your list
                    </p>
                    <Hinting label={label} side="right" asChild>
                    <Button className="h-auto p-2 ml-auto" variant="ghost" onClick={onCollapse}>
                       <ArrowLeftFromLine className="h-4 w-4" /> 
                    </Button>
                    </Hinting>
                </div>
            )}
        </>
    );
};