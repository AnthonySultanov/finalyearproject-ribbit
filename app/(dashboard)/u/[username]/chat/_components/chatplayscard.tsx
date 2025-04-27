"use client";

import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { updatestream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

interface ChatPlaysCardProps {
  isEnabled: boolean;
  allowedKeys: string;
}

export const ChatPlaysCard = ({ isEnabled = false, allowedKeys = "wasd" }: ChatPlaysCardProps) => {
  const [isPending, startTransition] = useTransition();
  const [showKeySelector, setShowKeySelector] = useState(isEnabled);
  const [selectedKeys, setSelectedKeys] = useState(allowedKeys);
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = async () => {
    try {
      setIsLoading(true);
      const response = await updatestream({
        isChatPlaysEnabled: !isEnabled
      });
      
      //this will show success toast
      toast.success(`Chat Plays ${!isEnabled ? "enabled" : "disabled"}`);
      setShowKeySelector(!isEnabled);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onKeysChange = async (value: string) => {
    try {
      setIsLoading(true);
      const response = await updatestream({
        allowedChatKeys: value
      });
      

      toast.success("Chat keys updated");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-center justify-between">
        <p className="font-semibold shrink-0">Chat Plays</p>
        <div className="space-y-2">
          <Switch disabled={isPending} checked={isEnabled} onCheckedChange={onToggle}>
            {isEnabled ? "Enabled" : "Disabled"}
          </Switch>
        </div>
      </div>
      
      {showKeySelector && (
        <div className="mt-4 space-y-2">
          <Label htmlFor="key-select">Allowed Keys</Label>
          <Select disabled={isPending} value={selectedKeys} onValueChange={onKeysChange}>
            <SelectTrigger id="key-select">
              <SelectValue placeholder="Select keys" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arrows">Arrow Keys (I=Up, K=Down, J=Left, L=Right, S=Space)</SelectItem>
              <SelectItem value="alphabet">All Letters (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          
          <p className="text-xs text-muted-foreground mt-2">
            When enabled, viewers can type these keys in chat to control your game/application.
          </p>
        </div>
      )}
    </div>
  );
};

export const ChatPlaysCardSkeleton = () => {
  return <Skeleton className="rounded-xl p-10 w-full" />;
};
