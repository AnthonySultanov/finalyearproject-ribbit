"use client"

import { Input } from "@/components/ui/input";
import { AutoCopyButton } from "./autocopybutton";
import { Button } from "@/components/ui/button";
import { useState } from "react";


interface CardKeyProps {
    value: string | null;
}




export const TheKeyCard = ({value}: CardKeyProps) => {

    const [show, setShow] = useState(false);



    return (
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-start gap-x-10">
                <p className="font-semibold shrink-0">Key</p>
               <div className="space-y-2 w-full">
                <div className="w-full flex items-center gap-x-2">
            <Input value={value || ""} type={show ? "text" : "password"} disabled placeholder="Stream key" />
            <AutoCopyButton value={value || ""} />
               </div>
               <Button onClick={() => setShow(!show)} variant="link" size="sm" >
                {show ? "Hide" : "Show"}
               </Button>
            </div>
        </div>
        </div>
    )
}







