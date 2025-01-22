import { z } from 'zod'

export const FormDataSchema = z.object({
  opportunityId: z.string().min(1, 'Id da oportunidade é obrigatório'),
  proposalDate: z.string().min(1, 'Data da proposta é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF é obrigatório'),
  rg: z.string().min(7, 'RG é obrigatório'),
  phone: z.string().min(7, 'Telefone é obrigatório'),
  email: z.string().min(1, 'Email é obrigatório').email('Endereço de email inválido'),
  nationality: z.string().min(1, 'Nacionalidade é obrigatório'),
  maritalStatus: z.enum(['Casado', 'Solteiro'], { message: 'Estado civíl inválido' }),
  birthDate: z.string().min(7, 'Data de Nascimento é obrigatório'),
  address: z.string().min(7, 'Endereço é obrigatório'),
  zipCode: z.string().min(8, 'Cep é Obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é Obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatório'),
  state: z.string().min(1, 'Estado é obrigatório'),
})