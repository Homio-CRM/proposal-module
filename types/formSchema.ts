import { z } from 'zod'

export const FormDataSchema = z.object({
  proposalDate: z.string().min(1, 'Data da proposta é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF é obrigatório').regex(new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/), 'CPF deve ser formatado como: 000.000.000-00'),
  rg: z.string().min(7, 'RG é obrigatório'),
  phone: z.string().min(7, 'Telefone é obrigatório'),
  email: z.string().min(1, 'Email é obrigatório').email('Email deve ser formatado como exemplo@exemplo.com'),
  nationality: z.string().min(1, 'Nacionalidade é obrigatório'),
  maritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Separado(a)', 'Divorciado(a)',
    'Viúvo(a)', 'União Estável'], { message: 'Estado civíl é obrigatório' }),
  birthDate: z.string().min(7, 'Data de nascimento é obrigatório'),
  address: z.string().min(7, 'Endereço é obrigatório'),
  zipCode: z.string().min(8, 'Cep é obrigatório').max(9, 'Cep deve ser formatado como: 00000-000').regex(new RegExp(/^\d{5}-\d{3}$/), 'Cep deve ser formatado como: 00000-000'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatório'),
  state: z.string().min(1, 'Estado é obrigatório'),
  spouseName: z.string().min(1, 'Nome do cônjuge é obrigatório').optional().or(z.literal('')),
  spouseCpf: z.string().min(11, 'CPF do cônjuge é obrigatório').optional().or(z.literal('')),
  spouseRg: z.string().min(7, 'RG do cônjuge é obrigatório').optional().or(z.literal('')),
  spouseNationality: z.string().min(1, 'Nacionalidade do cônjuge é obrigatório').optional().or(z.literal('')),
  spouseOccupation: z.string().min(1, 'Profissão do cônjuge é obrigatório').optional().or(z.literal('')),
  spouseEmail: z.string().min(1, 'Email do cônjuge é obrigatório').email('Email deve ser formatado como exemplo@exemplo.com').optional().or(z.literal('')),
  spousePhone: z.string().min(7, 'Telefone do cônjuge é obrigatório').optional().or(z.literal('')),
  spouseMaritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Separado(a)', 'Divorciado(a)',
    'Viúvo(a)', 'União Estável'], { message: 'Estado civíl é obrigatório' }),
  spouseAddress: z.string().min(7, 'Endereço é obrigatório'),
  spouseZipCode: z.string().min(8, 'Cep é obrigatório').max(9, 'Cep deve ser formatado como: 00000-000').regex(new RegExp(/^\d{5}-\d{3}$/), 'Cep deve ser formatado como: 00000-000'),
  spouseNeighborhood: z.string().min(1, 'Bairro é obrigatório'),
  spouseCity: z.string().min(1, 'Cidade é obrigatório'),
  spouseState: z.string().min(1, 'Estado é obrigatório'),
  building: z.enum(['Serena By Mivita', 'Lago By Mivita', 'Stage Praia do Canto', 'Next Jardim da Penha',
    'Inside Jardim da Penha', 'Quartzo By Mivita'], { message: 'Empreendimento é obrigatório' }),
  apartmentUnity: z.string().min(1, 'Unidade é obrigatório'),
  floor: z.string().min(1, 'Pavimento é obrigatório'),
  tower: z.string().min(1, 'Torre é obrigatório'),
  vendor: z.string().min(1, 'Responsável é obrigatório'),
  reservedUntill: z.string().optional(),
  observations: z.string().optional(),
  installments: z.array(z.object({
    type: z.enum(['Sinal', 'Parcela única', 'Financiamento', 'Mensais', 'Intermediárias', 'Anuais',
      'Semestrais', 'Bimestrais', 'Trimestrais'
    ], { message: 'Condição inválida' }),
    installmentsValue: z.string().min(1, 'Valor é Obrigatório'),
    amount: z.number().min(1, 'Quantidade é Obrigatório'),
    totalValue: z.string().optional(),
    paymentDate: z.string().min(1, 'Data é Obrigatório'),
  })),
  opportunityId: z.string().min(1, 'Id da oportunidade é obrigatório'),
  opportunityName: z.string(),
  mainContactId: z.string(),
  spouseContactId: z.string().optional(),
  proposalId: z.string().optional(),
})