import { z } from 'zod'

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const zipRegex = /^\d{5}-\d{3}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const FormDataSchema = z.object({
  proposalDate: z.string().min(1, 'Data da proposta é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string()
    .min(11, 'CPF é obrigatório')
    .regex(cpfRegex, 'CPF deve ser formatado como: 000.000.000-00'),
  rg: z.string().min(7, 'RG é obrigatório'),
  phone: z.string().min(7, 'Telefone é obrigatório'),
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ser formatado como exemplo@exemplo.com'),
  nationality: z.string().min(1, 'Nacionalidade é obrigatório'),
  maritalStatus: z.enum(
    ['Solteiro(a)', 'Casado(a)', 'Separado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'],
    { message: 'Estado civil é obrigatório' }
  ),
  birthDate: z.string().min(7, 'Data de nascimento é obrigatório'),
  address: z.string().min(7, 'Endereço é obrigatório'),
  zipCode: z.string()
    .min(8, 'Cep é obrigatório')
    .regex(zipRegex, 'Cep deve ser formatado como: 00000-000'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatório'),
  state: z.string().min(1, 'Estado é obrigatório'),
  occupation: z.string().min(1, 'Profissão é obrigatório'),

  spouseName: z.string().optional(),
  spouseCpf: z.string().optional().refine(
    v => typeof v === 'string' ? (v === '' || cpfRegex.test(v)) : true,
    'CPF do cônjuge deve ser formatado como: 000.000.000-00'
  ),
  spouseRg: z.string().optional().refine(
    v => typeof v === 'string' ? (v === '' || v.length >= 7) : true,
    'RG do cônjuge deve ter no mínimo 7 caracteres'
  ),
  spouseNationality: z.string().optional(),
  spouseOccupation: z.string().optional(),
  spouseEmail: z.string().optional().refine(
    v => typeof v === 'string' ? (v === '' || emailRegex.test(v)) : true,
    'Email do cônjuge deve ser formatado como exemplo@exemplo.com'
  ),
  spousePhone: z.string().optional().refine(
    v => typeof v === 'string' ? (v === '' || v.length >= 7) : true,
    'Telefone do cônjuge deve ter no mínimo 7 dígitos'
  ),
  spouseMaritalStatus: z.enum(
    ['Solteiro(a)', 'Casado(a)', 'Separado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'],
    { message: 'Estado civil do cônjuge inválido' }
  ).optional(),
  spouseAddress: z.string().optional(),
  spouseZipCode: z.string().optional().refine(
    v => typeof v === 'string' ? (v === '' || zipRegex.test(v)) : true,
    'Cep do cônjuge deve ser formatado como: 00000-000'
  ),
  spouseNeighborhood: z.string().optional(),
  spouseCity: z.string().optional(),
  spouseState: z.string().optional(),

  building: z.enum(
    ['Serena By Mivita', 'Lago By Mivita', 'Stage Praia do Canto', 'Next Jardim da Penha',
      'Inside Jardim da Penha', 'Quartzo By Mivita'],
    { message: 'Empreendimento é obrigatório' }
  ),
  apartmentUnity: z.string().min(1, 'Unidade é obrigatório'),
  floor: z.string().optional(),
  tower: z.string().optional(),
  vendor: z.string().min(1, 'Responsável é obrigatório'),
  reservedUntill: z.string().optional(),
  observations: z.string().optional(),

  installments: z.array(
    z.object({
      type: z.enum(
        ['Sinal', 'Parcela única', 'Financiamento', 'Mensais', 'Intermediárias', 'Anuais', 'Semestrais', 'Bimestrais', 'Trimestrais'],
        { message: 'Condição inválida' }
      ),
      installmentsValue: z.string().min(1, 'Valor é obrigatório'),
      amount: z.number().min(1, 'Quantidade é obrigatório'),
      totalValue: z.string().optional(),
      paymentDate: z.string().min(1, 'Data é obrigatório'),
    })
  ),

  opportunityId: z.string().min(1, 'Id da oportunidade é obrigatório'),
  opportunityName: z.string().min(1, 'Nome da oportunidade é obrigatório'),
  mainContactId: z.string().min(1, 'Id do contato principal é obrigatório'),
  spouseContactId: z.string().optional(),
  proposalId: z.string().optional(),
})
