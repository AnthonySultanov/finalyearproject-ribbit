"use client";
import { Dialog,DialogClose,DialogContent,DialogHeader,DialogTitle,DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Hinting } from "../hinting";
import {ElementRef, startTransition, useRef, useState, useTransition} from "react";
import { toast } from "sonner";
import { updatestream } from "@/actions/stream";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadstreamthumbnail";
import { Trash } from "lucide-react";


interface StreamInformationProps {
    initialName: string;
    initialThumbnailUrl: string | null;
  }

  export const StreamInformation = ({ initialName, initialThumbnailUrl }: StreamInformationProps) => {



    const router = useRouter();
    const closereffrencefrence = useRef<ElementRef<"button">>(null);
    const [name, setName] = useState(initialName);
    const [streamthumbnailUrl, setStreamThumbnailUrl] = useState(initialThumbnailUrl);
    const [isPending, startTransition] = useTransition();





   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      updatestream({ name: name })
        .then(() => {
          toast.success("Updated");
          closereffrencefrence?.current?.click();
        })
        .catch(() => toast.error("Error"));
    });
  };

  const onRemove = () => {
    startTransition(() => {
      updatestream({ thumbnailUrl: null })
        .then(() => {
          toast.success("Removed thumbnail");
          setStreamThumbnailUrl("");
          closereffrencefrence?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
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
          <DialogTitle>Edit about stream</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-14">
          <div className="space-y-2">
            <Label>
              Name
            </Label>
            <Input disabled={isPending} placeholder="Stream name" onChange={onChange}value={name}/>
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            {streamthumbnailUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <div className="absolute top-2 right-2 z-[10]">
                  <Hinting label="Remove thumbnail" asChild side="left">
                    <Button type="button" disabled={isPending} onClick={onRemove} className="h-auto w-auto p-1.5">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Hinting>
                </div>
                <Image alt="Thumbnail" src={streamthumbnailUrl} fill className="object-cover"/>
              </div>
            ) : (
              <div className="rounded-xl border outline-dashed outline-muted">
                <UploadDropzone
                  endpoint="thumbnailUploader"
                  appearance={{label: { color: "#ffffff" },allowedContent: { color: "#ffffff" },}}
                  onClientUploadComplete={(res: any) => {
                    console.log("Upload response:", res);
                    if (res && res[0] && res[0].url) {
                      setStreamThumbnailUrl(res[0].url);
                      startTransition(() => {
                        updatestream({ thumbnailUrl: res[0].url })
                          .then(() => {
                            toast.success("Thumbnail added");
                            router.refresh();
                            closereffrencefrence?.current?.click();
                          })
                          .catch((err) => {
                            console.error("Add thumbnail error:", err);
                            toast.error("Error adding thumbnail");
                          });
                      });
                    } else {
                      toast.error("error uploading thumbnail");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    console.error("Upload error:", error);
                    toast.error(`Upload error: ${error.message}`);
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <DialogClose ref={closereffrencefrence} asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} variant="primary" type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    )
}
