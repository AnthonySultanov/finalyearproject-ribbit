import { createUploadthing, type FileRouter } from "uploadthing/next";
import { infouser } from "@/lib/services-fetchuser";
import { db } from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
    thumbnailUploader: f({
        image: {
          maxFileSize: "8MB",
          maxFileCount: 1,
        },
      }).middleware(async () => {
        const self = await infouser();
  
        return { user: self };
      }).onUploadComplete(async ({ metadata, file }) => {
        console.log("Upload complete", metadata.user.id, file.url);
        
        await db.streaming.update({
          where: { userId: metadata.user.id },
          data: { thumbnailUrl: file.url },
        });

        return { fileUrl: file.url };
      }),
  } satisfies FileRouter;
  
  export type OurFileRouter = typeof ourFileRouter;