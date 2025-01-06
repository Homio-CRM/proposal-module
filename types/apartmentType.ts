export type Apartment = {
    id: string
    status: "Alugada" | "Contrato" | "Disponível" | "Permuta" | "Reservada" | "Vendida"
    enterprise: string
    price: string
  }