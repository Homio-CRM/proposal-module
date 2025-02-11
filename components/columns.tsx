"use client"
import { Apartment } from "@/types/apartmentType";
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<Apartment>[] = [
  {
    accessorKey: "id",
    header: "Unidade",
  },
  {
    accessorKey: "status",
    header: "Situação",
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    accessorKey: "enterprise",
    header: "Empreendimento",
  },
]
