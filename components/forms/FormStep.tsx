'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form'
import { FormStepConfig } from '@/config/formFields'
import { FormField } from './FormField'

interface FormStepProps {
    step: FormStepConfig
    register: UseFormRegister<any>
    errors: FieldErrors<any>
    control?: Control<any>
    delta: number
    onOpportunityBlur?: () => void
    onCepBlur?: () => void
    filteredUnits?: Array<{ value: string; label: string }>
}

export function FormStep({ step, register, errors, control, delta, onOpportunityBlur, onCepBlur, filteredUnits }: FormStepProps) {
    return (
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-8">
                {step.fields.map((field: any) => {
                    // Se for o campo de unidade e temos unidades filtradas, usar elas
                    const fieldConfig = field.name === 'apartmentUnity' && filteredUnits
                        ? { ...field, options: filteredUnits }
                        : field

                    return (
                        <FormField
                            key={field.name}
                            field={fieldConfig}
                            register={register}
                            errors={errors}
                            control={control}
                            onOpportunityBlur={field.name === 'opportunityId' ? onOpportunityBlur : undefined}
                            onCepBlur={field.name === 'zipCode' ? onCepBlur : undefined}
                        />
                    )
                })}
            </div>
        </motion.div>
    )
}