'use client'

import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { z } from 'zod'
import { FormDataSchema } from '@/types/formSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { Button } from "@/components/ui/button";
import { GetOpportunities } from "@/lib/requests"
import { GetContacts } from "@/lib/requests"
import { Contact } from '@/types/contactType'
import { Opportunity } from '@/types/opportunityType'


type Inputs = z.infer<typeof FormDataSchema>

const steps = [
  {
    id: 'Passo 1',
    name: 'Personal Information',
    fields: ['oppportunityId', 'proposalDate', 'name', 'cpf', 'rg', 'nationality', 'maritalStatus', 'birthDate', 'email', 'phone', 'address', 'zipCode', 'city', 'neighborhood', 'state'],
    subTitle: 'Preencha o ID da oportunidade  para criar a sua proposta.'
  },
  {
    id: 'Passo 2',
    name: 'Cônjuge',
    fields: ['spouseName', 'spouseCpf', 'spouseRg', 'spouseNationality', 'spouseOccupation', 'spouseEmail', 'spousePhone'],
    subTitle: 'Confira os dados do cônjuge'
  },
  {
    id: 'Passo 3',
    name: 'Empreendimento',
    fields: ['building', 'apartmentUnity', 'floor', 'tower', 'vendor', 'reserved', 'observations', 'contractDate'],
    subTitle: 'Confira os dados do empreendimento'
  },
  {
    id: 'Passo 4',
    name: 'Parcelas',
    fields: ['installments'],
    subTitle: 'Confira as parcelas'
  },
  { id: 'Passo 5', name: 'Complete' }
]




export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [conctactDataOpacity, setConctactDataOpacity] = useState(0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const delta = currentStep - previousStep

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    watch,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "installments",
  });

  const processForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    reset()
  }

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)()
      }
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }


  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(fields.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleDeleteSelected = () => {
    remove(selectedRows);
    setSelectedRows([]);
    setSelectAll(false);
  };

  async function updateInformations() {
    const opportunityId = watch('opportunityId')
    const opportunity = await GetOpportunities(opportunityId)
    if (!opportunity) return;
    const contactId = opportunity.contactId
    const contact = await GetContacts('F38opVNCOgBwGNzqp773')
    updateLabels(contact, opportunity)
  }

  function CheckCpf(cpf: string): string {
    if (cpf && /^.{11,14}$/.test(cpf)) {
      cpf = cpf.replace(/\D/g, '');
      cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
    return cpf
  }

  function updateLabels(contact: Contact, opportunity: Opportunity) {
    reset({
      name: contact.firstName + ' ' + contact.lastName,
      cpf: CheckCpf(contact.customFields.find(item => item.id === 'Z6NSHw77VAORaZKcAQr9')?.value as string),
      rg: contact.customFields.find(item => item.id === 'JZZb9gPOSISid1vp3rHh')?.value,
      nationality: contact.customFields.find(item => item.id === '1Xj4odQLI2L5FsXT5jmO')?.value,
      maritalStatus: contact?.customFields.find(item => item.id === 'a5b5vH65cVyb9QxUF5ef')?.value,
      birthDate: contact.dateOfBirth,
      email: contact.email,
      phone: contact.phone,
      address: contact.address1 + contact?.customFields.find(item => item.id === 'K8u7EgoKjMRZdq8Mnhku')?.value,
      zipCode: contact.postalCode,
      city: contact.city,
      neighborhood: contact.customFields.find(item => item.id === 'BppzAoRqxsTWpdFcJwam')?.value,
      state: contact.state,
      spouseName: contact.customFields.find(item => item.id === 'pkKduZf7cQrfaB7At0qO')?.value,
      spouseCpf: CheckCpf(contact.customFields.find(item => item.id === 'O0n5OIILrSve13ZcFiA0')?.value as string),
      spouseRg: contact.customFields.find(item => item.id === '2j2YXdg5ND441jRpMohZ')?.value,
      spouseNationality: contact.customFields.find(item => item.id === 'rUcp7m2vwTP6Rt7d58q4')?.value,
      spouseOccupation: contact.customFields.find(item => item.id === 'nYaPQ7t2q8gAoelEQq7d')?.value,
      spouseEmail: contact.customFields.find(item => item.id === 'yYf8GlPPsYiQr0ZVKNNE')?.value,
      spousePhone: contact.customFields.find(item => item.id === 'hV8KQRdmFjGQuXqPC5Ah')?.value,
      building: opportunity.customFields.find(item => item.id === 'EVdLCbbyeUrBrMIFmZVX')?.fieldValueArray[0] as 
      | "Serena By Mivita"
      | "Lago By Mivita"
      | "Stage Praia do Canto"
      | "Next Jardim da Penha"
      | "Inside Jardim da Penha"
      | "Quartzo By Mivita"
      | undefined,
      apartmentUnity: contact.customFields.find(item => item.id === 'stOGiUa4CDw4mxbo03kU')?.value,
      floor: contact.customFields.find(item => item.id === '65p4lHnuDMqJFeX2iMBI')?.value,
      tower: contact.customFields.find(item => item.id === 'CH2ojxtTvuVhbYxzpyME')?.value,
      vendor: opportunity.customFields.find(item => item.id === 'UxgoVhhSfTrIG9RFaUJ5')?.fieldValueString,
      reservedUntill: contact.customFields.find(item => item.id === 'jQI7mltRg2JulEJZUYwc')?.value,
      observations: contact.customFields.find(item => item.id === 'DcFDxA1BhIzMbpedd8Jc')?.value,
    })
  }

  return (
    <>
      <section className='flex flex-col justify-between mt-6 ml-6 max-w-7xl'>
        <h1 className='text-gray-900 text-3xl'>Criar nova proposta</h1>
        <p className='text-gray-600 font-normal'>{steps[currentStep].subTitle}</p>
        {/* steps */}
        <nav aria-label='Progress' className='mt-8'>
          <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
            {steps.map((step, index) => (
              <li key={step.name} className='md:flex-1'>
                {currentStep > index ? (
                  <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                    <span className='text-sm font-medium text-sky-600 transition-colors '>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                    aria-current='step'
                  >
                    <span className='text-sm font-medium text-sky-600'>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                ) : (
                  <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                    <span className='text-sm font-medium text-gray-500 transition-colors'>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form */}
        <form className='py-6 max-w-ml-65xl' onSubmit={handleSubmit(processForm)}>
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-8'>
                <div className='sm:col-span-6'>
                  <label
                    htmlFor='opportunityId'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Id da Oportunidade
                  </label>
                  <div className='mt-1 border-[1px] border-gray-100 hover:bg-white p-0  bg-gray-0 rounded-md shadow-sm  flex text-gray-900'>
                    <input
                      placeholder='digite aqui...'
                      type='text'
                      id='opportunityId'
                      {...register('opportunityId')}
                      autoComplete='given-name'
                      className='block w-full bg-transparent p-1.5 pl-3 placeholder:gray-200 font-medium focus:bg-white !outline-none sm:text-sm sm:leading-6'
                    />

                    <button type='button'
                      onClick={updateInformations}
                      className='p-1.5'>

                      <Search className='text-blue-300 p-1' />

                    </button>
                    {errors.opportunityId?.message && (
                      <p className='text-sm font-medium text-red-400 absolute mt-11'>
                        {errors.opportunityId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='lastName'
                    className='block text-sm leading-6 font-bold text-gray-900'
                  >
                    Data da Proposta
                  </label>
                  <div className='mt-1'>
                    <input
                      type='date'
                      id='proposalDate'
                      {...register('proposalDate')}
                      autoComplete='family-name'
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.proposalDate?.message && (
                      <p className='mt-2  font-medium text-sm text-red-400'>
                        {errors.proposalDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`sm:col-span-4 opacity-${conctactDataOpacity}`}>
                  <label
                    htmlFor='name'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Nome
                  </label>
                  <div className='mt-2'>
                    <input
                      id='name'
                      type='text'
                      {...register('name')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.name?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`sm:col-span-2 opacity-${conctactDataOpacity}`}>
                  <label
                    htmlFor='cpf'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    CPF
                  </label>
                  <div className='mt-2'>
                    <input
                      id='cpf'
                      type='text'
                      {...register('cpf')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.cpf?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.cpf.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`sm:col-span-2 opacity-${conctactDataOpacity}`}>

                  <label
                    htmlFor='rg'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    RG
                  </label>
                  <div className='mt-2'>
                    <input
                      id='rg'
                      type='text'
                      {...register('rg')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.rg?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.rg.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`sm:col-span-4 opacity-${conctactDataOpacity}`}>
                  <label
                    htmlFor='nationality'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Nacionalidade
                  </label>
                  <div className='mt-2'>
                    <input
                      id='nationality'
                      type='text'
                      {...register('nationality')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.nationality?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='maritalStatus'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Estado Civil
                  </label>
                  <div className='mt-2'>
                  <select
                      id='maritalStatus'
                      {...register('maritalStatus')}
                      className='px-3 w-full rounded-md border-0 py-2.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    >
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Separado(a)">Separado(a)</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                      <option value="União Estável">União Estável</option>
                    </select>
                    {errors.maritalStatus?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.maritalStatus.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='birthDate'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Data de Nascimento
                  </label>
                  <div className='mt-2'>
                    <input
                      id='birthDate'
                      type='date'
                      {...register('birthDate')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.birthDate?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='email'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Email
                  </label>
                  <div className='mt-2'>
                    <input
                      id='email'
                      type='text'
                      {...register('email')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.email?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Telefone
                  </label>
                  <div className='mt-2'>
                    <input
                      id='phone'
                      type='text'
                      {...register('phone')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.phone?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                </div>

                <div className='sm:col-span-4'>
                  <label
                    htmlFor='address'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Endereço
                  </label>
                  <div className='mt-2'>
                    <input
                      id='address'
                      type='text'
                      {...register('address')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.address?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='zipCode'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    CEP
                  </label>
                  <div className='mt-2'>
                    <input
                      id='zipCode'
                      type='text'
                      {...register('zipCode')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.zipCode?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-1'></div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='city'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Cidade
                  </label>
                  <div className='mt-2'>
                    <input
                      id='city'
                      type='text'
                      {...register('city')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.city?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                </div>


                <div className='sm:col-span-2'>
                  <label
                    htmlFor='neighborhood'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Bairro
                  </label>
                  <div className='mt-2'>
                    <input
                      id='neighborhood'
                      type='text'
                      {...register('neighborhood')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.neighborhood?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.neighborhood.message}
                      </p>
                    )}
                  </div>

                </div>


                <div className='sm:col-span-1'>
                  <label
                    htmlFor='state'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Estado
                  </label>
                  <div className='mt-2'>
                    <input
                      id='state'
                      type='text'
                      {...register('state')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.state?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8'>

                <div className='sm:col-span-4'>
                  <label
                    htmlFor='spouseName'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Cônjuge
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseName'
                      type='text'
                      {...register('spouseName')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.spouseName?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.spouseName.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='spouseCpf'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    CPF
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseCpf'
                      type='text'
                      {...register('spouseCpf')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.spouseCpf?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.spouseCpf.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='spouseRg'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    RG
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseRg'
                      type='text'
                      {...register('spouseRg')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.spouseRg?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.spouseRg.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='spouseNationality'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Nacionalidade
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseNationality'
                      type='text'
                      {...register('spouseNationality')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.spouseNationality?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.spouseNationality.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='spouseOccupation'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Profissão
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseOccupation'
                      type='text'
                      {...register('spouseOccupation')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.spouseOccupation?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.spouseOccupation.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='spouceOcuppation'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Email
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseEmail'
                      type='text'
                      {...register('spouseEmail')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.spouseEmail?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.spouseEmail.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='spouceOcuppation'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Telefone
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spousePhone'
                      type='text'
                      {...register('spousePhone')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.spousePhone?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.spousePhone.message}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8'>

                <div className='sm:col-span-4'>
                  <label
                    htmlFor='building'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Empreendimento
                  </label>
                  <div className='mt-2'>
                    <select
                      id='building'
                      {...register('building')}
                      className='px-3 w-full rounded-md border-0 py-2.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    >
                      <option value="Serena By Mivita">Serena By Mivita</option>
                      <option value="Lago By Mivita">Lago By Mivita</option>
                      <option value="Stage Praia do Canto">Stage Praia do Canto</option>
                      <option value="Next Jardim da Penha">Next Jardim da Penha</option>
                      <option value="Inside Jardim da Penha">Inside Jardim da Penha</option>
                      <option value="Quartzo By Mivita">Quartzo By Mivita</option>
                    </select>
                    {errors.building?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.building.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-4'></div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='apartmentUnity'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Unidade
                  </label>
                  <div className='mt-2'>
                    <input
                      id='apartmentUnity'
                      type='text'
                      {...register('apartmentUnity')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.apartmentUnity?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.apartmentUnity.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='floor'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Pavimento
                  </label>
                  <div className='floor'>
                    <input
                      id='floor'
                      type='text'
                      {...register('floor')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.floor?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.floor.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-1'>
                  <label
                    htmlFor='tower'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Torre
                  </label>
                  <div className='mt-2'>
                    <input
                      id='tower'
                      type='text'
                      {...register('tower')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.tower?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.tower.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-3'></div>
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='vendor'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Responsável
                  </label>
                  <div className='mt-2'>
                    <input
                      id='vendor'
                      type='text'
                      {...register('vendor')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.vendor?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.vendor.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-2
                '>
                  <label
                    htmlFor='reserved'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Reservado até
                  </label>
                  <div className='mt-2'>
                    <input
                      id='reservedUntill'
                      type='date'
                      {...register('reservedUntill')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                  </div>

                </div>
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='observations'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Observações
                  </label>
                  <div className='mt-2'>

                    <textarea
                      rows={5}
                      id='observations'
                      {...register('observations')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    >

                    </textarea>
                  </div>

                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='contractDate'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Data do Contrato
                  </label>
                  <div className='mt-2'>

                    <input
                      type='date'
                      id='contractDate'
                      {...register('contractDate')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />


                    {errors.contractDate?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.contractDate.message}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          )}


          {currentStep === 3 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="w-full flex justify-end">
                <Button
                  type="button"
                  onClick={() => append({ type: "Sinal", value: "", amount: 1, percentage: "100%", paymentDate: "" })}
                  className="m-4 bg-indigo-500 hover:bg-indigo-600 text-md"
                >
                  + Nova Parcela
                </Button>
              </div>
              <table id="installments" className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-0 border-y border-gray-50 text-left">
                    <th className="p-2 font-medium font-sans uppercase text-gray-500">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className='mr-12 ml-4 p-12 scale-125 border border-gray-700'
                      />
                    </th>
                    <th className="p-2 font-medium font-sans uppercase text-gray-500">Condição</th>
                    <th className="p-2 font-medium font-sans uppercase  text-gray-500">Valor</th>
                    <th className="p-2 font-medium font-sans uppercase  text-gray-500">Qnt. de Parcelas</th>
                    <th className="p-2 font-medium font-sans uppercase  text-gray-500">Percentual</th>
                    <th className="p-2 font-medium font-sans uppercase  text-gray-500">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(index)}
                          onChange={() => toggleRowSelection(index)}
                          className='mr-12 ml-4 scale-125 border border-gray-700'
                        />
                      </td>
                      <td className="py-4">
                        <select className="w-full p-4 bg-gray-50 max-w-max appearance-none rounded-md text-gray-800 font-semibold" {...register(`installments.${index}.type`)}>

                          <option className='text-gray-800 font-semibold' value="Sinal">Sinal</option>
                          <option className='text-gray-800 font-semibold' value="Parcela única">Parcela única</option>
                          <option className='text-gray-800 font-semibold' value="Mensais">Mensais</option>
                          <option className='text-gray-800 font-semibold' value="Intermediárias">Intermediárias</option>
                          <option className='text-gray-800 font-semibold' value="Anuais">Anuais</option>
                          <option className='text-gray-800 font-semibold' value="30 dias">30 dias</option>
                          <option className='text-gray-800 font-semibold' value="60 dias">60 dias</option>
                          <option className='text-gray-800 font-semibold' value="Contrato">Especial</option>
                          <option className='text-gray-800 font-semibold' value="90 dias">90 dias</option>
                          <option className='text-gray-800 font-semibold' value="120 dias">120 dias</option>
                          <option className='text-gray-800 font-semibold' value="Despesa nacompra (30 ?)">Despesa na compra (30 ?)</option>
                          <option className='text-gray-800 font-semibold' value="Despesa na compra (60 ?)">Despesa na compra (60 ?)</option>
                          <option className='text-gray-800 font-semibold' value="Bimestrais">Bimestrais</option>
                          <option className='text-gray-800 font-semibold' value="Trimestrais">Trimestrais</option>
                          <option className='text-gray-800 font-semibold' value="Comissão Apartada">Comissão Apartada</option>
                          <option className='text-gray-800 font-semibold' value="Permuta">Permuta</option>
                          <option className='text-gray-800 font-semibold' value="Chaves"> Chaves</option>
                        </select>
                      </td>
                      <td className="text-gray-300 font-normal p-2">
                        <div className='flex content-center font-semibold text-gray-300'>
                          <p>
                            R$
                          </p>
                          <input
                            type="text"
                            className=" font-semibold p-1 w-full"
                            {...register(`installments.${index}.value`)}
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="text-gray-300 font-semibold p-1 w-full"
                          {...register(`installments.${index}.amount`, { valueAsNumber: true })}
                        />
                      </td>
                      <td className=" p-2">
                        <input
                          type="text"
                          className=" p-1 w-full"
                          {...register(`installments.${index}.percentage`)}
                        />
                      </td>
                      <td className=" p-2">
                        <input
                          type="date"
                          className=" p-1 w-full"
                          {...register(`installments.${index}.paymentDate`)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex gap-4">
                <Button type="button" onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                  Excluir Selecionados
                </Button>
              </div>


            </motion.div>
          )}
          {currentStep === 4 && (
            <>
              <h2 className='text-base font-semibold leading-7 text-gray-900'>
                Complete
              </h2>
              <p className='mt-1 text-sm leading-6 text-gray-600'>
                Thank you for your submission.
              </p>
            </>
          )}
        </form>

        {/* Navigation */}
        <div className='mt-8 pt-5'>
          <div className='w-full flex justify-end gap-6'>
            <button
              type='button'
              onClick={prev}
              disabled={currentStep === 0}
              className={` rounded-full
               bg-[#F3F1FF] px-16 py-2 text-md font-medium text-gray-500 shadow-sm 
                hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Voltar
            </button>
            <button
              type='button'
              onClick={next}
              className='rounded-full bg-gradient-to-r from-purple-300
               to-indigo-500 px-16 py-2 text-md font-medium text-indigo-0 
               shadow-sm  hover:bg-sky-50  disabled:cursor-not-allowed disabled:opacity-50'
            >
              {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
            </button>
          </div>
        </div>
      </section >
    </>
  )
}