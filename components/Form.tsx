'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { FormDataSchema } from '@/types/formSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  patchMainContact,
  patchSpouseContact,
  postSpouseContact,
  postRelation,
  postProposal,
  patchOpportunity,
  patchProposal,
  updateUnitStatus
} from "@/lib/requests"

import { formSteps } from '@/config/formFields'
import { FormStep } from '@/components/forms/FormStep'
import { StepIndicator } from '@/components/forms/StepIndicator'
import { InstallmentsTable } from '@/components/forms/InstallmentsTable'
import { useProposal } from '@/hooks/useProposal'
import { useContacts } from '@/hooks/useContacts'
import { useOpportunity } from '@/hooks/useOpportunity'
import { useUnits } from '@/hooks/useUnits'
import { useCep } from '@/hooks/useCep'
import Loading from '@/components/Loading'
import { GlobalError } from '@/components/GlobalError'
import { useUserDataContext } from '@/lib/contexts/UserDataContext'

type Inputs = z.infer<typeof FormDataSchema>

const completionStep = { id: '5', title: 'Complete', subtitle: '', fields: [] }
const allSteps = [...formSteps, completionStep]

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const delta = currentStep - previousStep
  const id = useSearchParams().get("recordId")

  // Usando o contexto UserData para acessar currentLocation
  const { userData, loading: userDataLoading, error: userDataError } = useUserDataContext()

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

  const { isLoading: proposalLoading, currentUnit, searchProposal } = useProposal(setValue)
  const { searchContacts } = useContacts(setValue)
  const { isLoading: opportunityLoading, searchOpportunity } = useOpportunity(setValue, watch)
  const { isLoadingUnits, filteredUnits } = useUnits(setValue, watch, currentUnit)
  const { searchCep, isLoading: cepLoading } = useCep()

  const handleSearchProposalCallback = React.useCallback(async (proposalId: string) => {
    const result = await searchProposal(proposalId)
    if (result) {
      await searchContacts(result.contactId, result.spouseId)
    }
  }, [searchProposal, searchContacts])

  useEffect(() => {
    if (id) {
      handleSearchProposalCallback(id)
    }
  }, [id, handleSearchProposalCallback])

  const handleOpportunityBlur = async () => {
    const oppId = watch('opportunityId')
    if (!oppId || oppId.trim() === '') return

    try {
      const result = await searchOpportunity()
      if (result) {
        await searchContacts(result.contactId, result.spouseId)
      }
    } catch (error) {
      setGlobalError('Erro ao buscar oportunidade. Verifique o ID informado.')
    }
  }

  const handleCepBlur = async () => {
    const zipCode = watch('zipCode')

    if (!zipCode || zipCode.trim() === '') return

    try {
      const cepData = await searchCep(zipCode)

      if (cepData) {
        setValue('address', cepData.logradouro)
        setValue('neighborhood', cepData.bairro)
        setValue('city', cepData.localidade)
        setValue('state', cepData.uf)
      }
    } catch (error) {
      setGlobalError('Erro ao buscar CEP. Verifique o código informado.')
    }
  }


  const handleSearchOpportunity = async () => {
    try {
      const result = await searchOpportunity()
      if (result) {
        await searchContacts(result.contactId, result.spouseId)
      }
    } catch (error) {
      setGlobalError('Erro ao buscar oportunidade. Verifique o ID informado.')
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true)
    setGlobalError(null)
    try {
      await patchMainContact(data)

      if (data.spouseContactId) {
        await patchSpouseContact(data)
      } else {
        const spouseContact = await postSpouseContact(data)
        await postRelation(data.opportunityId, spouseContact.id)
      }

      const totalProposalValue = (watch("installments") || []).reduce((acc, curr) => {
        const value = (Number(curr.installmentsValue) || 0) * (Number(curr.amount) || 0)
        return acc + value
      }, 0)

      if (data.proposalId) {
        await patchProposal(data, totalProposalValue)
      } else {
        await postProposal(data, totalProposalValue)
      }

      await patchOpportunity(data)
      await updateUnitStatus(data)

      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('Error submitting form:', error)
      setGlobalError('Erro ao salvar proposta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const next = async () => {
    const fields = formSteps[currentStep]?.fields.map(f => f.name) || []
    const output = await trigger(fields as (keyof Inputs)[], { shouldFocus: true })

    if (currentStep === allSteps.length - 1) {
      window.location.reload()
    }

    if (!output) return

    if (currentStep < allSteps.length - 1) {
      if (currentStep === allSteps.length - 2) {
        try {
          await handleSubmit(onSubmit)()
        } catch (error) {
          console.error("Erro na submissão:", error)
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

  const renderCurrentStep = () => {
    if (currentStep < formSteps.length) {
      const currentStepConfig = formSteps[currentStep]

      if (currentStep === 3) {
        return (
          <InstallmentsTable
            register={register}
            control={control}
            watch={watch}
            delta={delta}
            isLoading={isLoading}
          />
        )
      }

      return (
        <FormStep
          step={currentStepConfig}
          register={register}
          errors={errors}
          control={control}
          delta={delta}
          onOpportunityBlur={currentStep === 0 ? handleOpportunityBlur : undefined}
          onCepBlur={currentStep === 0 ? handleCepBlur : undefined}
        />
      )
    }

    if (currentStep === allSteps.length - 1) {
      return (
        <motion.div
          initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mt-12 flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center rounded-full w-[140px] h-[140px] shadow-[0px_0px_30px_rgba(0,0,0,0)] bg-indigo-500 shadow-indigo-500/60">
            <Image width={60} height={60} src="checkmark.svg" alt="Success" />
          </div>
          <h2 className="mt-4 text-xl font-semibold leading-7 text-gray-900">
            Proposta criada com sucesso
          </h2>
          <p className="text-sm font-medium leading-6 text-gray-600">
            Selecione uma opção abaixo
          </p>
          <Button
            onClick={next}
            className="mt-8 bg-indigo-500 hover:bg-indigo-600 px-20 py-2 shadow-lg shadow-indigo-500/40"
          >
            Criar outra
          </Button>
          <Button
            onClick={prev}
            variant="outline"
            className="mt-3 px-16 py-2 bg-[#F3F1FF] text-gray-500 hover:bg-gray-100"
          >
            Voltar
          </Button>
        </motion.div>
      )
    }

    return null
  }

  const showLoading = proposalLoading || opportunityLoading || isLoadingUnits || cepLoading || isLoading || userDataLoading

  return (
    <section className="flex flex-col justify-between">
      <GlobalError error={globalError} onClose={() => setGlobalError(null)} />

      {/* Exemplo de uso do currentLocation */}
      {userData && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>Agência Ativa (currentLocation):</strong> {userData.activeLocation}
        </div>
      )}

      <h1 className="text-gray-900 text-3xl font-bold">Criar nova proposta</h1>
      <p className="text-gray-600 font-medium">
        {allSteps[currentStep]?.subtitle || allSteps[currentStep]?.title}
      </p>

      <StepIndicator steps={allSteps} currentStep={currentStep} />

      {showLoading && <Loading />}

      <form className="py-6 max-w-ml-65xl" onSubmit={handleSubmit(onSubmit)}>
        {renderCurrentStep()}
      </form>

      <div className="fixed bottom-6 right-6 flex gap-4 z-50">
        <button
          type="button"
          onClick={prev}
          disabled={currentStep === 0}
          className={`px-16 py-3 text-lg rounded-full shadow-lg bg-[#F3F1FF] text-gray-500 hover:bg-gray-100 flex items-center justify-center leading-none border border-gray-200 ${currentStep === allSteps.length - 1 ? "hidden" : "block"}`}
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={next}
          disabled={isLoading}
          className={`px-16 py-3 text-lg rounded-full shadow-lg bg-gradient-to-r from-purple-300 to-indigo-500 hover:opacity-90 flex items-center justify-center leading-none text-white ${currentStep === allSteps.length - 1 ? "hidden" : "block"}`}
        >
          {currentStep === allSteps.length - 1
            ? "Criar nova proposta"
            : currentStep === allSteps.length - 2
              ? "Finalizar"
              : "Próximo"
          }
        </button>
      </div>
    </section>
  )
}