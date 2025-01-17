import { z } from 'zod'

export const FormDataSchema = z.object({
  opportunityId: z.string().min(1, 'Id da oportunidade é obrigatório'),
  proposalDate: z.string().min(1, 'Data da proposta é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF é obrigatório'),
  rg: z.string().min(7, 'RG é obrigatório'),
  email: z.string().min(1, 'Email é obrigatório').email('Endereço de email inválido'),
  country: z.string().min(1, 'Country is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'Zip is required')
})