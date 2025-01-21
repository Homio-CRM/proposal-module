import React from 'react'
import { Apartment } from '@/types/apartmentType'
import { columns } from "@/components/columns"
import { DataTable } from "@/components/data-table"

  export const data: Apartment[] = [
    {
      id: "1202 COB",
      enterprise: "Stage Praia do Canto",
      status: "Alugada",
      price: "106,11%",
    },
    {
      id: "1202 COB",
      enterprise: "Stage Praia do Canto",
      status: "Contrato",
      price: "106,11%",
    },
    {
      id: "1202 COB",
      enterprise: "Stage Praia do Canto",
      status: "Disponível",
      price: "106,11%",
    },
    {
      id: "1202 COB",
      enterprise: "Stage Praia do Canto",
      status: "Permuta",
      price: "106,11%",
    },
    {
      id: "1202 COB",
      enterprise: "Stage Praia do Canto",
      status: "Reservada",
      price: "106,11%",
    },
    {
      id: "1202 COB",
      enterprise: "Stage Praia do Canto",
      status: "Vendida",
      price: "106,11%",
    },
  ]

export default function Home() {
  return (
    <div >
    <DataTable columns={columns} data={data} />
  </div>
  )
}
