import { z } from 'zod'

export const FormDataSchema = z.object({
  opportunityId: z.string().min(1, 'Id da oportunidade é obrigatório'),
  proposalDate: z.string().min(1, 'Data da proposta é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF é obrigatório').regex(new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/), 'CPF inválido'),
  rg: z.string().min(7, 'RG é obrigatório'),
  phone: z.string().min(7, 'Telefone é obrigatório'),
  email: z.string().min(1, 'Email é obrigatório').email('Endereço de email inválido'),
  nationality: z.string().min(1, 'Nacionalidade é obrigatório'),
  maritalStatus: z.enum(['Casado(a)', 'Solteiro(a)', 'Separado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'], { message: 'Estado civíl inválido' }),
  birthDate: z.string().min(7, 'Data de Nascimento é obrigatório'),
  address: z.string().min(7, 'Endereço é obrigatório'),
  zipCode: z.string().min(8, 'Cep é Obrigatório').regex(new RegExp(/^(\d{5})(\d{3})$/), 'Cep inválido'),
  neighborhood: z.string().min(1, 'Bairro é Obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatório'),
  state: z.string().min(1, 'Estado é obrigatório'),
  spouseName: z.string().min(1, 'Nome do Cônjuge é obrigatório'),
  spouseCpf: z.string().min(11, 'CPF é obrigatório'),
  spouseRg: z.string().min(7, 'RG é obrigatório'),
  spouseNationality: z.string().min(1, 'Nacionalidade é obrigatório'),
  spouseOccupation: z.string().min(1, 'Profissão  é obrigatório'),
  spouseEmail: z.string().min(1, 'Email é obrigatório').email('Endereço de email inválido'),
  spousePhone: z.string().min(7, 'Telefone é obrigatório'),
  building: z.enum(['Serena By Mivita', 'Lago By Mivita', 'Stage Praia do Canto', 'Next Jardim da Penha',
    'Inside Jardim da Penha', 'Quartzo By Mivita'], { message: 'Empreendimento inválido' }),
  apartmentUnity: z.string().min(1, 'Unidade é obrigatório'),
  floor: z.string().min(1, 'Pavimento é obrigatório'),
  tower: z.string().min(1, 'Torre é obrigatório'),
  vendor: z.string().min(1, 'Responsável é obrigatório'),
  reservedUntill: z.string().optional(),
  observations: z.string().optional(),
  contractDate: z.string().min(7, 'Data do contrato é obrigatório'),
  installments: z.array(z.object({
    type: z.enum(['Sinal', 'Parcela única', 'Mensais', 'Intermediárias', 'Anuais',
      'Financiamento', '30 dias', '60 dias', 'Contrato', 'Especial',
      '90 dias', '120 dias', 'Despesa na  compra (30 ?)',
      'Despesa na  compra (60 ?)', 'Bimestrais', 'Trimestrais',
      'Bienais', 'Trienais', 'Comissão Apartada', 'Permuta', 'Chaves'
    ], { message: 'Condição inválida' }),
    value: z.string().min(1, 'Valor é Obrigatório'),
    amount: z.number().min(1, 'Quantidade é Obrigatório'),
    percentage: z.string().min(1, 'Percentual é Obrigatório'),
    paymentDate: z.string().min(1, 'Data é Obrigatório'),
  }))
})