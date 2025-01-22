import React from 'react'
import { Apartment } from '@/types/apartmentType'
import { columns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import { getOrCreateToken } from '@/lib/auth'

export const data: Apartment[] = [
  {
    id: "1202 COB",
    enterprise: "Stage Praia do Canto",
    status: "Disponível",
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
    status: "Disponível",
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
    status: "Disponível",
    price: "106,11%",
  },
]



export default async function Home() {
  const token = getOrCreateToken()
  console.log(token)

  return (
    <div className="bg-black">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
