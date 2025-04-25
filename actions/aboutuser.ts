"use server";

import { userlogged } from "@prisma/client";
import { infouser } from "@/lib/services-fetchuser";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";


export const updatebio = async (values: Partial<userlogged>) => {
    try {
        const self = await infouser();
        const validData = {
            bio: values.bio,
          };
          //here we will update the bio
          const user = await db.userlogged.update({
            where: { id: self.id },
            data: { ...validData },
          });
        revalidatePath(`/${self.username}`);
        revalidatePath(`/u/${self.username}`);

        return user;

    } catch  {
        throw new Error("Failed to update bio");

    }
}








