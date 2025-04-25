"use client"
import { Button } from "@/components/ui/button"
import { Dialog,DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ElementRef, useRef, useState, useTransition } from "react"
import { createingress } from "@/actions/ingress";
import { toast } from "sonner"

//this will use string values to avoid serialization issues
const RTMP = "RTMP";
const WHIP = "WHIP";

type IngressType = typeof RTMP | typeof WHIP;

//this will be the connecting model for the keys

export const ConnectingModel = () => {
    const [ingressType, setIngressType] = useState<IngressType>(RTMP);
    const [isPending, startTransition] = useTransition();
    const closeRef = useRef<ElementRef<"button">>(null);

    const onSubmit = () => {
        startTransition(() => {
            createingress(ingressType)
                .then(() => {
                    toast.success("Stream key generated successfully");
                    closeRef?.current?.click();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error("Failed to generate stream key");
                });
        });
    };
      
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary">
                    Generate Key
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Generate Key
                    </DialogTitle>
                </DialogHeader>
                <Select 
                    disabled={isPending} 
                    value={ingressType}
                    onValueChange={(value: IngressType) => setIngressType(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a ingress/key type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={RTMP}>RTMP</SelectItem>
                        <SelectItem value={WHIP}>WHIP</SelectItem>
                    </SelectContent>
                </Select>
                <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTitle>
                        Warning
                    </AlertTitle>
                    <AlertDescription>
                        This action is not reversible.
                    </AlertDescription>
                </Alert>
                <div className="flex justify-between">
                    <DialogClose ref={closeRef}>
                        <Button variant="ghost">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                        disabled={isPending} 
                        onClick={onSubmit} 
                        variant="primary"
                    >
                        Generate Key
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}




