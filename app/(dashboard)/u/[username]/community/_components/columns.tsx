"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { UserPF } from "@/components/usericon";
import { ArrowUpDown } from "lucide-react";
import { UnblockUserButton } from "./unblockuserbutton";


export type BlockedUser = {
    userId: string;
  imageUrl: string;
  username: string;
  createdAt: string;
  id: string;
}

export const columns: ColumnDef<BlockedUser>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Username
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <UserPF
          username={row.original.username}
          imageUrl={row.original.imageUrl}
        />
        <span>{row.original.username}</span>
      </div>
    ),
  },
  
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date blocked
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UnblockUserButton userId={row.original.userId} />,
  },
]
