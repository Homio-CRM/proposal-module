'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { z } from 'zod'
import { FormDataSchema } from '@/types/formSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'



type Inputs = z.infer<typeof FormDataSchema>

const steps = [
  {
    id: 'Step 1',
    name: 'Personal Information',
    fields: ['oppportunityId', 'proposalDate', 'name', 'cpf', 'rg'],
    subTitle: 'Preencha o ID da oportunidade  para criar a sua proposta.'
  },
  {
    id: 'Step 2',
    name: 'Con',
    fields: ['country', 'state', 'city', 'street', 'zip'],
    subTitle: 'Confira os dados do cônjuge'
  },
  {
    id: 'Step 3',
    name: 'Address',
    fields: ['country', 'state', 'city', 'street', 'zip'],
    subTitle: 'Confira os dados do cônjuge'
  },
  {
    id: 'Step 4',
    name: 'Address',
    fields: ['country', 'state', 'city', 'street', 'zip'],
    subTitle: 'Confira os dados do cônjuge'
  },
  { id: 'Step 5', name: 'Complete' }
]

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })

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

  return (
    <>
      <section className='flex flex-col justify-between mt-6 ml-6 max-w-7xl'>
        {/* steps */}
        <nav aria-label='Progress'>
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
                    <button className='p-1.5'>
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

                <div className='sm:col-span-4'>
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
                <div className='sm:col-span-2'>
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
                <div className='sm:col-span-2'>
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
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='nationality'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Nacionalidade
                  </label>
                  <div className='block'>
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
                  <div className='block'>
                    <input
                      id='maritalStatus'
                      type='text'
                      {...register('maritalStatus')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
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
                  <div className='block'>
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
                  <div className='block'>
                    <input
                      id='email'
                      type='text'
                      {...register('email')}
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

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Telefone
                  </label>
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                    htmlFor='spouceNationality'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Nacionalidade
                  </label>
                  <div className='block'>
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
                    htmlFor='spouceOcuppation'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Profissão
                  </label>
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                    htmlFor='spouseName'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Empreendimento
                  </label>
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
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
                  <div className='block'>
                    <input
                      id='reservedUntill'
                      type='date'
                      {...register('reservedUntill')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    />
                    {errors.reservedUntill?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.reservedUntill.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='observations'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Observações
                  </label>
                  <div className='block'>

                    <textarea
                      rows={5}
                      id='observations'
                      {...register('observations')}
                      className='px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6'
                    >

                    </textarea>
                    {errors.observations?.message && (
                      <p className='mt-2 text-sm font-medium text-red-400'>
                        {errors.observations.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='contractDate'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Data do Contrato
                  </label>
                  <div className='block'>

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
              <table className="w-full border-collapse border border-gray">
                <thead>
                  <tr className="bg-gray-">
                    <th className="border p-2">Condição</th>
                    <th className="border p-2">Valor</th>
                    <th className="border p-2">Qnt. de Parcelas</th>
                    <th className="border p-2">Percentual</th>
                    <th className="border p-2">Data</th>
                  </tr>
                </thead>
              </table>
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
              disabled={currentStep === steps.length - 1}
              className='rounded-full bg-gradient-to-r from-purple-300
               to-indigo-500 px-16 py-2 text-md font-medium text-indigo-0 
               shadow-sm  hover:bg-sky-50  disabled:cursor-not-allowed disabled:opacity-50'
            >
              Próximo
            </button>
          </div>
        </div>
      </section>
    </>
  )
}