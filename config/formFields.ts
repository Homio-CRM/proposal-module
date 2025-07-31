export type FieldType = 'text' | 'email' | 'date' | 'select' | 'textarea' | 'search' | 'cep' | 'cpf' | 'phone' | 'date-br'

export interface FormFieldConfig {
    name: string
    label: string
    type: FieldType
    placeholder?: string
    required?: boolean
    validation?: string
    options?: Array<{ value: string; label: string }>
    colSpan?: number
    searchAction?: () => void
}

export interface FormStepConfig {
    id: string
    title: string
    subtitle: string
    fields: FormFieldConfig[]
}

export const personalInfoFields: FormFieldConfig[] = [
    {
        name: 'opportunityId',
        label: 'Id da Oportunidade',
        type: 'search',
        placeholder: 'digite aqui...',
        required: true,
        colSpan: 6
    },
    {
        name: 'proposalDate',
        label: 'Data da Proposta',
        type: 'date-br',
        required: true,
        colSpan: 2
    },
    {
        name: 'name',
        label: 'Nome',
        type: 'text',
        required: true,
        colSpan: 4
    },
    {
        name: 'cpf',
        label: 'CPF',
        type: 'cpf',
        required: true,
        validation: 'cpf',
        colSpan: 2
    },
    {
        name: 'rg',
        label: 'RG',
        type: 'text',
        required: true,
        colSpan: 2
    },
    {
        name: 'nationality',
        label: 'Nacionalidade',
        type: 'text',
        required: true,
        colSpan: 4
    },
    {
        name: 'maritalStatus',
        label: 'Estado Civil',
        type: 'select',
        required: true,
        colSpan: 2,
        options: [
            { value: 'Solteiro(a)', label: 'Solteiro(a)' },
            { value: 'Casado(a)', label: 'Casado(a)' },
            { value: 'Separado(a)', label: 'Separado(a)' },
            { value: 'Divorciado(a)', label: 'Divorciado(a)' },
            { value: 'Viúvo(a)', label: 'Viúvo(a)' },
            { value: 'União Estável', label: 'União Estável' }
        ]
    },
    {
        name: 'birthDate',
        label: 'Data de Nascimento',
        type: 'date-br',
        required: true,
        colSpan: 2
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        colSpan: 4
    },
    {
        name: 'phone',
        label: 'Telefone',
        type: 'phone',
        required: true,
        colSpan: 2
    },
    {
        name: 'zipCode',
        label: 'CEP',
        type: 'cep',
        required: true,
        validation: 'cep',
        colSpan: 2
    },
    {
        name: 'address',
        label: 'Endereço',
        type: 'text',
        required: true,
        colSpan: 4
    },
    {
        name: 'neighborhood',
        label: 'Bairro',
        type: 'text',
        required: true,
        colSpan: 2
    },
    {
        name: 'city',
        label: 'Cidade',
        type: 'text',
        required: true,
        colSpan: 2
    },
    {
        name: 'state',
        label: 'Estado',
        type: 'text',
        required: true,
        colSpan: 1
    }
]

export const spouseFields: FormFieldConfig[] = [
    {
        name: 'spouseName',
        label: 'Cônjuge',
        type: 'text',
        colSpan: 3
    },
    {
        name: 'spouseCpf',
        label: 'CPF',
        type: 'text',
        validation: 'cpf',
        colSpan: 1
    },
    {
        name: 'spouseRg',
        label: 'RG',
        type: 'text',
        colSpan: 2
    },
    {
        name: 'spouseNationality',
        label: 'Nacionalidade',
        type: 'text',
        colSpan: 2
    },
    {
        name: 'spouseMaritalStatus',
        label: 'Estado Civil',
        type: 'select',
        colSpan: 2,
        options: [
            { value: 'Solteiro(a)', label: 'Solteiro(a)' },
            { value: 'Casado(a)', label: 'Casado(a)' },
            { value: 'Separado(a)', label: 'Separado(a)' },
            { value: 'Divorciado(a)', label: 'Divorciado(a)' },
            { value: 'Viúvo(a)', label: 'Viúvo(a)' },
            { value: 'União Estável', label: 'União Estável' }
        ]
    },
    {
        name: 'spouseOccupation',
        label: 'Profissão',
        type: 'text',
        colSpan: 2
    },
    {
        name: 'spouseEmail',
        label: 'Email',
        type: 'email',
        colSpan: 4
    },
    {
        name: 'spousePhone',
        label: 'Telefone',
        type: 'phone',
        colSpan: 2
    },
    {
        name: 'spouseState',
        label: 'Estado',
        type: 'text',
        colSpan: 1
    },
    {
        name: 'spouseCity',
        label: 'Cidade',
        type: 'text',
        colSpan: 1
    },
    {
        name: 'spouseNeighborhood',
        label: 'Bairro',
        type: 'text',
        colSpan: 2
    },
    {
        name: 'spouseZipCode',
        label: 'CEP',
        type: 'text',
        validation: 'cep',
        colSpan: 1
    },
    {
        name: 'spouseAddress',
        label: 'Endereço',
        type: 'text',
        colSpan: 4
    }
]

export const propertyFields: FormFieldConfig[] = [
    {
        name: 'building',
        label: 'Empreendimento',
        type: 'select',
        required: true,
        colSpan: 4,
        options: [
            { value: 'Serena By Mivita', label: 'Serena By Mivita' },
            { value: 'Lago By Mivita', label: 'Lago By Mivita' },
            { value: 'Stage Praia do Canto', label: 'Stage Praia do Canto' },
            { value: 'Next Jardim da Penha', label: 'Next Jardim da Penha' },
            { value: 'Inside Jardim da Penha', label: 'Inside Jardim da Penha' },
            { value: 'Quartzo By Mivita', label: 'Quartzo By Mivita' }
        ]
    },
    {
        name: 'apartmentUnity',
        label: 'Unidade',
        type: 'select',
        required: true,
        colSpan: 2
    },
    {
        name: 'floor',
        label: 'Pavimento',
        type: 'text',
        colSpan: 2
    },
    {
        name: 'tower',
        label: 'Torre',
        type: 'text',
        colSpan: 1
    },
    {
        name: 'vendor',
        label: 'Responsável',
        type: 'text',
        required: true,
        colSpan: 4
    },
    {
        name: 'reservedUntill',
        label: 'Reservado até',
        type: 'date-br',
        colSpan: 2
    },
    {
        name: 'observations',
        label: 'Observações',
        type: 'textarea',
        colSpan: 4
    }
]

export const formSteps: FormStepConfig[] = [
    {
        id: '1',
        title: 'Informações Pessoais',
        subtitle: 'Preencha o ID da oportunidade para criar a sua proposta.',
        fields: personalInfoFields
    },
    {
        id: '2',
        title: 'Cônjuge',
        subtitle: 'Confira os dados do cônjuge',
        fields: spouseFields
    },
    {
        id: '3',
        title: 'Empreendimento',
        subtitle: 'Confira os dados do empreendimento',
        fields: propertyFields
    },
    {
        id: '4',
        title: 'Parcelas',
        subtitle: 'Confira as parcelas',
        fields: []
    }
]