import React from 'react'
import { Apartment } from '@/types/apartmentType'
import { columns } from "./columns"
import { DataTable } from "./data-table"

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
  

const page = () => {
  return (
    <div className="container">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default page