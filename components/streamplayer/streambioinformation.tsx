"use client";

import { Dialog, DialogContent,DialogClose, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Hinting } from "../hinting";
import { useRef } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { updatebio } from "@/actions/aboutuser";
import { ElementRef } from "react";








interface StreamBioInformationProps {
    initialValue: string | null;
}

export const StreamBioInformation = ({initialValue}: StreamBioInformationProps) => {
    const closereffrence = useRef<ElementRef<"button">>(null);
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(initialValue || "");
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      startTransition(() => {
        updatebio({ bio: value })
          .then(() => {
            toast.success("Bio Updated");
            closereffrence.current?.click();
          })
          .catch(() => toast.error("error"));
      });
    };

   return (
    <Dialog>
    <DialogTrigger asChild>
    <Button variant="link" size="sm" className="ml-auto">
        Edit
    </Button>
    </DialogTrigger>

    <DialogContent>
    <DialogHeader>
    <DialogTitle>Edit user bio</DialogTitle>
    </DialogHeader>


    <form onSubmit={onSubmit} className="space-y-4">
        <Textarea placeholder="User bio" onChange={(e) => setValue(e.target.value)} value={value} disabled={isPending} className="resize-none" />
        <div className="flex justify-between">
          <DialogClose ref={closereffrence} asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isPending} type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
   )
    
}