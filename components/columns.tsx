"use client"
import { Unit } from "@/types/unitType";
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<Unit>[] = [
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
