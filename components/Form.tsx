'use client'

import { useSearchParams } from 'next/navigation'
import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { z } from 'zod'
import { FormDataSchema } from '@/types/formSchema'
import { Contact } from '@/types/contactType'
import { Opportunity } from '@/types/opportunityType'
import { Proposal } from '@/types/proposalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller, SubmitHandler, useFieldArray } from 'react-hook-form'
import { GroupBase, SingleValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { Button } from "@/components/ui/button"
import { checkCpf, checkCep, checkPaymentFlow } from '@/lib/validations'
import { getOpportunities, getContacts, postSpouseContact, patchMainContact, patchSpouseContact, postRelation, postProposal, patchOpportunity, getProposal, getDevelopment, getUnit, patchProposal, getAvailablesUnits } from "@/lib/requests"
import { Unit, Units } from '@/types/unitType'
import Loading from '@/components/Loading'

type Inputs = z.infer<typeof FormDataSchema>
type UnitOption = { value: string; label: string }

const steps = [
  {
    id: '1',
    name: 'Personal Information',
    fields: ['oppportunityId', 'proposalDate', 'name', 'cpf', 'rg', 'nationality', 'maritalStatus', 'birthDate', 'email', 'phone', 'address', 'zipCode', 'city', 'neighborhood', 'state'],
    subTitle: 'Preencha o ID da oportunidade  para criar a sua proposta.'
  },
  {
    id: '2',
    name: 'Cônjuge',
    fields: ['spouseName', 'spouseCpf', 'spouseRg', 'spouseNationality', 'spouseOccupation', 'spouseEmail', 'spousePhone', 'spouseAddress', 'spouseZipCode', 'spouseCity', 'spouseNeighborhood', 'spouseState'],
    subTitle: 'Confira os dados do cônjuge'
  },
  {
    id: '3',
    name: 'Empreendimento',
    fields: ['building', 'apartmentUnity', 'floor', 'tower', 'vendor', 'reserved', 'observations'],
    subTitle: 'Confira os dados do empreendimento'
  },
  {
    id: '4',
    name: 'Parcelas',
    fields: ['installments'],
    subTitle: 'Confira as parcelas'
  },
  { id: '5', name: 'Complete' }
]

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUnits, setIsLoadingUnits] = useState(false)
  const [conctactDataOpacity] = useState(0)
  const [allUnits, setAllUnits] = useState<Unit[]>([])
  const [currentUnit, setCurrentUnit] = useState<Unit>()
  const [filteredUnits, setFilteredUnits] = useState<UnitOption[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const delta = currentStep - previousStep
  const id = useSearchParams().get("recordId")
  useEffect(() => {
    if (id) {
      searchProposal(id);
    }
    async function loadUnits() {
      setIsLoadingUnits(true)
      const availableUnits: Units = await getAvailablesUnits()
      setAllUnits(availableUnits.units);
      setIsLoadingUnits(false)
    }
    loadUnits()
  }, [id]);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    watch,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })

  const selectedBuilding = watch('building');
  useEffect(() => {
    if (!selectedBuilding) {
      setFilteredUnits([])
      return
    }
    if (!isLoadingUnits) {
      if (!allUnits.find(item => item.id === currentUnit?.id) && currentUnit) {
        setAllUnits(allUnits.concat(currentUnit))
        setValue("apartmentUnity", currentUnit.id)
      }
      setFilteredUnits(
        allUnits
          .filter(u => u.development === selectedBuilding)
          .map(u => ({ value: u.id, label: u.name }))
      )
    }
  }, [selectedBuilding, allUnits])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "installments",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true)
    await patchMainContact(data)
    if (data.spouseContactId) {
      await patchSpouseContact(data)
    } else {
      const spouseContact = await postSpouseContact(data)
      await postRelation(data.opportunityId, spouseContact.id)
    }
    const totalProposalValue = (watch("installments") || []).reduce((acc, curr) => {
      const value = (Number(curr.installmentsValue) || 0) * (Number(curr.amount) || 0);
      return acc + value;
    }, 0)
    if (data.proposalId) {
      await patchProposal(data, totalProposalValue)
    } else {
      await postProposal(data, totalProposalValue)
    }
    await patchOpportunity(data)
    setIsLoading(false)
  }

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (currentStep === steps.length - 1) {
      window.location.reload();
    }
    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        try {
          await handleSubmit(onSubmit)()
        } catch (error) {
          console.error("Erro na submissão:", error);
        }
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

  async function searchProposal(id: string) {
    setIsLoading(true)
    const proposal = await getProposal(id)
    setValue("proposalId", id)
    if (!proposal) return;
    const contactId = proposal.relations.find(item => item.id === "67fd417a21ba9077d3f1c0d4")?.relation.find(item => item.key !== "custom_objects.proposals")?.value as string
    const spouseId = proposal.relations.find(item => item.id === "67fd5faa21ba903a1b02131e")?.relation.find(item => item.key !== "custom_objects.proposals")?.value as string
    const developmentId = proposal.relations.find(item => item.id === "67fd413b8eba9e985167762a")?.relation.find(item => item.key !== "custom_objects.proposals")?.value as string
    const unitId = proposal.relations.find(item => item.id === "67fd604421ba90b14302635f")?.relation.find(item => item.key !== "custom_objects.proposals")?.value as string
    await searchContacts(contactId, spouseId)
    await searchDevelopmentAndUnit(developmentId, unitId)
    await updateProposalLabels(proposal)
    setIsLoading(false)
  }

  async function searchOpportunity() {
    setIsLoading(true)
    const opportunity = await getOpportunities(watch('opportunityId'))
    if (!opportunity) return;
    const contactId = opportunity.contactId
    const spouseId = opportunity.relations.find(item => item.recordId !== opportunity.contactId)?.recordId
    await searchContacts(contactId, spouseId)
    await updateProposalLabels(opportunity)
    setIsLoading(false)
  }

  async function searchContacts(mainContactId: string, spouseContactId: string | undefined) {
    const contact = await getContacts(mainContactId)
    const spouse = spouseContactId ? await getContacts(spouseContactId) : null
    await updateContactsLabels(contact, spouse)
  }

  async function searchDevelopmentAndUnit(developmentId: string, unitId: string) {
    const development = await getDevelopment(developmentId)
    const unit = await getUnit(unitId)
    await updateDevelopmentLabels(development)
    const newUnit: Unit = {
      id: unit.id,
      name: unit.properties.name,
      development: development.properties.name
    };
    setCurrentUnit(newUnit)
  }

  function updateDevelopmentLabels(development: Proposal) {
    setValue(
      "building",
      development.properties.name as
      | "Serena By Mivita"
      | "Lago By Mivita"
      | "Stage Praia do Canto"
      | "Next Jardim da Penha"
      | "Inside Jardim da Penha"
      | "Quartzo By Mivita"
    );
  }

  function updateProposalLabels(param: Proposal | Opportunity): void {
    if ('properties' in param) {
      setValue("opportunityId", param.properties.opportunity_id);
      setValue("opportunityName", param.properties.name);
      setValue("proposalDate", param.properties.date);
      setValue("vendor", param.properties.responsable);
      setValue("reservedUntill", param.properties.reservation_date);
      setValue("observations", param.properties.observations);
      setValue("installments", checkPaymentFlow(param.properties.payment_flow))
    } else {
      setValue(
        "building",
        param.customFields?.find(item => item.id === 'EVdLCbbyeUrBrMIFmZVX')
          ?.fieldValueArray[0] as
        | "Serena By Mivita"
        | "Lago By Mivita"
        | "Stage Praia do Canto"
        | "Next Jardim da Penha"
        | "Inside Jardim da Penha"
        | "Quartzo By Mivita"
      );
      setValue(
        "vendor",
        param.customFields.find(item => item.id === 'UxgoVhhSfTrIG9RFaUJ5')
          ?.fieldValueString as string
      );
      setValue("opportunityName", param.name);
    }
  }

  function updateContactsLabels(contact: Contact, spouse: Contact | null) {
    setValue("mainContactId", contact.id);
    setValue("name", `${contact.firstName} ${contact.lastName}`);
    setValue(
      "cpf",
      checkCpf(contact.customFields.find(item => item.id === 'Z6NSHw77VAORaZKcAQr9')?.value as string)
    );
    setValue("rg", contact.customFields.find(item => item.id === 'JZZb9gPOSISid1vp3rHh')?.value as string);
    setValue("nationality", contact.customFields.find(item => item.id === '1Xj4odQLI2L5FsXT5jmO')?.value as string);
    setValue(
      "maritalStatus",
      contact.customFields.find(item => item.id === 'a5b5vH65cVyb9QxUF5ef')?.value as
      | "Solteiro(a)"
      | "Casado(a)"
      | "Separado(a)"
      | "Divorciado(a)"
      | "Viúvo(a)"
      | "União Estável"
    );
    setValue("birthDate", contact.dateOfBirth);
    setValue("email", contact.email);
    setValue("phone", contact.phone);
    setValue("address", contact.address1);
    setValue("zipCode", checkCep(contact.postalCode));
    setValue("city", contact.city);
    setValue("state", contact.state);
    setValue("neighborhood", contact.customFields.find(item => item.id === 'BppzAoRqxsTWpdFcJwam')?.value as string);
    setValue("apartmentUnity", contact.customFields.find(item => item.id === 'stOGiUa4CDw4mxbo03kU')?.value as string);
    setValue("floor", contact.customFields.find(item => item.id === '65p4lHnuDMqJFeX2iMBI')?.value as string);
    setValue("tower", contact.customFields.find(item => item.id === 'CH2ojxtTvuVhbYxzpyME')?.value as string);
    setValue("reservedUntill", contact.customFields.find(item => item.id === 'jQI7mltRg2JulEJZUYwc')?.value);
    setValue("observations", contact.customFields.find(item => item.id === 'DcFDxA1BhIzMbpedd8Jc')?.value);
    if (spouse) {
      setValue("spouseContactId", spouse.id);
      setValue("spouseName", `${spouse.firstName} ${spouse.lastName}`);
      setValue(
        "spouseCpf",
        checkCpf(spouse.customFields.find(item => item.id === 'Z6NSHw77VAORaZKcAQr9')?.value as string)
      );
      setValue("spouseRg", spouse.customFields.find(item => item.id === 'JZZb9gPOSISid1vp3rHh')?.value);
      setValue("spouseNationality", spouse.customFields.find(item => item.id === '1Xj4odQLI2L5FsXT5jmO')?.value);
      setValue("spouseOccupation", spouse.customFields.find(item => item.id === 'DJAJ8ugEhcq6am3ywUBU')?.value);
      setValue("spouseEmail", spouse.email);
      setValue("spousePhone", spouse.phone);
      setValue(
        "spouseMaritalStatus",
        spouse.customFields.find(item => item.id === 'a5b5vH65cVyb9QxUF5ef')?.value as
        | "Solteiro(a)"
        | "Casado(a)"
        | "Separado(a)"
        | "Divorciado(a)"
        | "Viúvo(a)"
        | "União Estável"
      );
      setValue("spouseAddress", spouse.address1);
      setValue("spouseZipCode", checkCep(spouse.postalCode));
      setValue("spouseCity", spouse.city);
      setValue("spouseNeighborhood", spouse.customFields.find(item => item.id === 'BppzAoRqxsTWpdFcJwam')?.value as string);
      setValue("spouseState", spouse.state);
    }
  }

  return (
    <>
      <section className='flex flex-col justify-between'>
        <h1 className='text-gray-900 text-3xl'>Criar nova proposta</h1>
        <p className='text-gray-600 font-medium'>{steps[currentStep].subTitle}</p>
        {/* steps */}
        <nav aria-label='Progress' className='mt-6'>
          <ol role='list' className='space-y-4 md:flex md:space-y-0'>
            {steps.map((step, index) => (
              <li key={step.name} className="">
                <div className="group flex justify-center items-center w-full flex-row border-l-2 border-gray-200 py-2 transition-colors md:border-l-0 mr-4">
                  <div className={`flex justify-center items-center size-[30px] rounded-full ${currentStep === steps.length - 1 ? "bg-gradient-to-r from-purple-600 to-blue-500" : currentStep > index ? "bg-gradient-to-r from-purple-600 to-blue-500" : "bg-gray-50"}`}>
                    <span className={`text-base font-medium ${currentStep === steps.length - 1 ? "text-white" : currentStep > index ? "text-white" : "text-gray-600"}`}>
                      {step.id}
                    </span>
                  </div>
                  {index === steps.length - 1 ? "" :
                    <div className={`w-[100px] h-[6px] bg-gray-50 ml-4 rounded-full ${currentStep > index ? "bg-gradient-to-r from-purple-600 to-blue-500" : "bg-gray-50"}`}></div>
                  }
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Form */}
        <form className='py-6 max-w-ml-65xl' onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {isLoading ? <Loading /> : ''}
              <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-8'>
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
                      onClick={searchOpportunity}
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

                <div className='sm:col-span-3'>
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
                <div className='sm:col-span-1'>
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
                <div className='sm:col-span-1'></div>
                <div className='sm:col-span-2'>
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
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='spouseMaritalStatus'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Estado Civil
                  </label>
                  <div className='mt-2'>
                    <select
                      id='spouseMaritalStatus'
                      {...register('spouseMaritalStatus')}
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
                <div className='sm:col-span-2'></div>

                <div className='sm:col-span-1'>
                  <label
                    htmlFor='spouseState'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Estado
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseState'
                      type='text'
                      {...register('spouseState')}
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

                <div className='sm:col-span-1'>
                  <label
                    htmlFor='spouseCity'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Cidade
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseCity'
                      type='text'
                      {...register('spouseCity')}
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
                    htmlFor='spouseNeighborhood'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Bairro
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseNeighborhood'
                      type='text'
                      {...register('spouseNeighborhood')}
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

                <div className='sm:col-span-2'></div>

                <div className='sm:col-span-4'>
                  <label
                    htmlFor='spouseAddress'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Endereço
                  </label>
                  <div className='mt-2'>
                    <input
                      id='spouseAddress'
                      type='text'
                      {...register('spouseAddress')}
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



              </div>






            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {isLoadingUnits ? <Loading /> : ''}
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
                <div className="sm:col-span-2">
                  <label
                    htmlFor="apartmentUnity"
                    className="block text-sm font-bold leading-6 text-gray-900"
                  >
                    Unidade
                  </label>

                  <Controller
                    name="apartmentUnity"
                    control={control}
                    defaultValue={watch("apartmentUnity")}
                    rules={{ required: 'Selecione uma unidade' }}
                    render={({ field }) => {
                      const selectedOption: UnitOption | null =
                        filteredUnits.find(opt => opt.value === field.value) ?? null

                      return (
                        <CreatableSelect<UnitOption, false, GroupBase<UnitOption>>
                          unstyled
                          inputId="apartmentUnity"
                          options={filteredUnits}
                          isSearchable
                          placeholder=""
                          noOptionsMessage={() => 'Nenhuma opção'}
                          value={selectedOption}
                          onChange={(opt: SingleValue<UnitOption>) =>
                            field.onChange(opt?.value ?? '')
                          }
                          onBlur={field.onBlur}
                          classNames={{
                            control: ({ isFocused }) =>
                              ` mt-2 px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1
                       focus:bg-white focus:ring-1 !focus:ring-gray-100 !outline-none ring-inset ring-gray-100 
                       placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6 ${isFocused ? 'bg-white' : ''}`,
                            option: () => "px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-sm",
                            menu: () => "bg-white border mt-1 rounded shadow z-10",
                            singleValue: () => "text-sm font-medium text-gray-900",
                            placeholder: () => "text-sm font-medium text-gray-400",
                          }}
                        />

                      )
                    }}
                  />
                  {errors.apartmentUnity && (
                    <p className="mt-2 text-sm font-medium text-red-400">
                      {errors.apartmentUnity.message}
                    </p>
                  )}
                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='floor'
                    className='block text-sm font-bold leading-6 text-gray-900'
                  >
                    Pavimento
                  </label>
                  <div className='floor mt-2'>
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
              </div>
            </motion.div>
          )}


          {currentStep === 3 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {isLoading ? <Loading /> : ''}
              <div className="w-full flex justify-end">
                <Button
                  type="button"
                  onClick={() => append({ type: "Sinal", totalValue: "", amount: 1, installmentsValue: "", paymentDate: "" })}
                  className="m-4 bg-indigo-500 hover:bg-indigo-600 text-md"
                >
                  + Nova Parcela
                </Button>
              </div>
              <table id="installments" className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-0 border-y border-gray-50 text-left">
                    <th className="p-2 font-bold font-sans uppercase text-gray-500">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className='mr-12 ml-4 p-12 scale-125 border border-gray-700'
                      />
                    </th>
                    <th className="text-sm p-2 font-semibold font-sans uppercase text-gray-500">Condição</th>
                    <th className="text-sm p-2 font-semibold font-sans uppercase  text-gray-500">Valor das parcelas</th>
                    <th className="text-sm p-2 font-semibold font-sans uppercase  text-gray-500">Qnt. de Parcelas</th>
                    <th className="text-sm p-2 font-semibold font-sans uppercase  text-gray-500">Valor total</th>
                    <th className="text-sm p-2 font-semibold font-sans uppercase  text-gray-500">Data</th>
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
                        <select className="w-full p-4 bg-gray-50 max-w-max appearance-none rounded-md text-gray-600 font-semibold" {...register(`installments.${index}.type`)}>

                          <option className='text-gray-600 font-semibold' value="Sinal">Sinal</option>
                          <option className='text-gray-600 font-semibold' value="Parcela única">Parcela única</option>
                          <option className='text-gray-600 font-semibold' value="Financiamento">Financiamento</option>
                          <option className='text-gray-600 font-semibold' value="Mensais">Mensais</option>
                          <option className='text-gray-600 font-semibold' value="Intermediárias">Intermediárias</option>
                          <option className='text-gray-600 font-semibold' value="Anuais">Anuais</option>
                          <option className='text-gray-600 font-semibold' value="30 dias">Semestrais</option>
                          <option className='text-gray-600 font-semibold' value="Bimestrais">Bimestrais</option>
                          <option className='text-gray-600 font-semibold' value="Trimestrais">Trimestrais</option>
                        </select>
                      </td>
                      <td className="text-gray-300 font-medium p-2">
                        <div className='flex content-center font-medium text-gray-300'>
                          <p className='text-gray-900 font-medium mt-1'>
                            R$
                          </p>
                          <input
                            type="text"
                            className="text-gray-300 font-medium p-1 w-full"
                            {...register(`installments.${index}.installmentsValue`)}
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="text-gray-300 font-medium p-1 w-full"
                          {...register(`installments.${index}.amount`, { valueAsNumber: true })}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={
                            (parseFloat(watch(`installments.${index}.installmentsValue`).replace('.', '').replace(',', '.')) || 0) *
                            (Number(watch(`installments.${index}.amount`)) || 0)}
                          readOnly
                          className="text-gray-300 font-medium p-1 w-full"
                          {...register(`installments.${index}.totalValue`)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          className="text-gray-300 font-medium p-1 w-full"
                          {...register(`installments.${index}.paymentDate`)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-2 pl-5 bg-gray-0" colSpan={6}>
                      <div className='flex flex-row text-gray-600'>
                        <p className='font-medium'>
                          VALOR TOTAL :
                        </p>
                        <p className='font-medium ml-4'>
                          R$
                        </p>
                        <p className='text-gray-600 font-medium ml-1'>
                          {(watch("installments") || []).reduce((acc, curr) => {
                            const value = (parseFloat(curr.installmentsValue.replace('.', '').replace(',', '.')) || 0) * (Number(curr.amount) || 0);
                            return acc + value;
                          }, 0)}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tfoot>
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

              <div className='mt-12 flex flex-col items-center justify-center'>
                <div className='flex items-center justify-center rounded-full w-[140px] h-[140px] shadow-[0px_0px_30px_rgba(0,0,0,0)] bg-indigo-500 shadow-indigo-500/60'>
                  <Image width={60} height={60} src='checkmark.svg' alt='Homio Logo'></Image>
                </div>
                <h2 className='mt-4 text-xl font-semibold leading-7 text-gray-900'>
                  Proposta criada com sucesso
                </h2>
                <p className='text-sm font-medium leading-6 text-gray-600'>
                  Selecione uma opção abaixo
                </p>
                <button onClick={next} className='mt-8 z-10 rounded-full bg-indigo-500 px-20 py-2 text-md font-medium text-indigo-0 
               shadow-lg shadow-indigo-500/40 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'>
                  Criar outra
                </button>
                <button onClick={prev} className='mt-3 rounded-full bg-[#F3F1FF] px-16 py-2 text-md font-medium text-gray-500 shadow-sm 
                hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'>
                  Voltar
                </button>
              </div>
            </>
          )}
        </form >

        {/* Navigation */}
        < div className='py-4' >
          <div className='w-full flex justify-end gap-6'>
            <button
              type='button'
              onClick={prev}
              disabled={currentStep === 0}
              className={`rounded-full
               bg-[#F3F1FF] px-16 py-2 text-md font-medium text-gray-500 shadow-sm 
                hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${currentStep === steps.length - 1 ? "hidden invisible" : "block visible"}`}
            >
              Voltar
            </button>
            <button
              type='button'
              onClick={next}
              disabled={isLoading}
              className={`rounded-full bg-gradient-to-r from-purple-300
               to-indigo-500 px-16 py-2 text-md font-medium text-indigo-0 
               shadow-sm hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 ${currentStep === steps.length - 1 ? "hidden invisible" : "block visible"}`}
            >
              {currentStep === steps.length - 1 ? "Criar nova proposta"
                : currentStep === steps.length - 2 ? "Finalizar" : "Próximo"}

            </button>
          </div>
        </div >
      </section >
    </>
  )
}