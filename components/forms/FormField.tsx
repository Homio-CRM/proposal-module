'use client'

import React from 'react'
import { UseFormRegister, FieldErrors, Control, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormFieldConfig } from '@/config/formFields'
import { cn } from '@/lib/utils'
import { applyCpfMask, applyCepMask, applyPhoneMask, applyDateMask, formatDateForInput, formatDateForAPI } from '@/utils/masks'
interface FormFieldProps {
    field: FormFieldConfig
    register: UseFormRegister<any>
    errors: FieldErrors<any>
    control?: Control<any>
    onOpportunityBlur?: () => void
    onCepBlur?: () => void
}

export function FormField({ field, register, errors, control, onOpportunityBlur, onCepBlur }: FormFieldProps) {
    const error = errors[field.name as string]
    const baseInputClasses = "px-3 w-full rounded-md border-0 py-1.5 bg-gray-0 text-gray-900 shadow-sm ring-1 focus:bg-white focus:ring-1 focus:ring-gray-100 outline-none ring-inset ring-gray-100 placeholder:text-gray-200 font-medium sm:text-sm sm:leading-6"

    const renderField = () => {
        switch (field.type) {
            case 'search':
                return (
                    <Input
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        className={cn(baseInputClasses, "focus:bg-white focus:ring-1 focus:ring-gray-100")}
                        onBlur={onOpportunityBlur}
                    />
                )

            case 'cep':
                return (
                    <Input
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        className={cn(baseInputClasses, "focus:bg-white focus:ring-1 focus:ring-gray-100")}
                        onChange={(e) => {
                            const maskedValue = applyCepMask(e.target.value)
                            e.target.value = maskedValue
                        }}
                        onBlur={onCepBlur}
                    />
                )

            case 'cpf':
                return (
                    <Input
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        className={cn(baseInputClasses, "focus:bg-white focus:ring-1 focus:ring-gray-100")}
                        onChange={(e) => {
                            const maskedValue = applyCpfMask(e.target.value)
                            e.target.value = maskedValue
                        }}
                    />
                )

            case 'phone':
                return (
                    <Input
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        className={cn(baseInputClasses, "focus:bg-white focus:ring-1 focus:ring-gray-100")}
                        onChange={(e) => {
                            const maskedValue = applyPhoneMask(e.target.value)
                            e.target.value = maskedValue
                        }}
                    />
                )

            case 'select':
                if (!control) return null
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => (
                            <Select onValueChange={controllerField.onChange} value={controllerField.value}>
                                <SelectTrigger className={cn(baseInputClasses, "h-10 py-2.5")}>
                                    <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                )

            case 'textarea':
                return (
                    <Textarea
                        rows={5}
                        {...register(field.name)}
                        className={cn(baseInputClasses, "min-h-[120px] resize-none")}
                    />
                )

            case 'date':
                return (
                    <Input
                        type="date"
                        {...register(field.name)}
                        className={baseInputClasses}
                    />
                )

            case 'date-br':
                return (
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="DD/MM/AAAA"
                            {...register(field.name, {
                                setValueAs: (value) => {
                                    // Converte para formato YYYY-MM-DD apenas para o react-hook-form
                                    if (value && value.includes('/')) {
                                        return formatDateForAPI(value)
                                    }
                                    return value
                                }
                            })}
                            className={cn(baseInputClasses, "focus:bg-white focus:ring-1 focus:ring-gray-100 pr-10")}
                            onChange={(e) => {
                                const maskedValue = applyDateMask(e.target.value)
                                e.target.value = maskedValue
                            }}
                        />
                        <Input
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                // Quando seleciona no date picker, converte para formato brasileiro
                                if (e.target.value) {
                                    const brFormat = formatDateForInput(e.target.value)
                                    const input = e.target.parentElement?.querySelector('input[type="text"]') as HTMLInputElement
                                    if (input) {
                                        input.value = brFormat
                                        input.dispatchEvent(new Event('input', { bubbles: true }))
                                    }
                                }
                            }}
                        />
                    </div>
                )

            case 'email':
                return (
                    <Input
                        type="email"
                        {...register(field.name)}
                        className={baseInputClasses}
                    />
                )

            default:
                return (
                    <Input
                        type="text"
                        {...register(field.name)}
                        className={baseInputClasses}
                    />
                )
        }
    }

    const getColSpanClass = () => {
        const colSpan = field.colSpan || 1
        const colSpanMap: Record<number, string> = {
            1: 'sm:col-span-1',
            2: 'sm:col-span-2',
            3: 'sm:col-span-3',
            4: 'sm:col-span-4',
            6: 'sm:col-span-6'
        }
        return colSpanMap[colSpan] || 'sm:col-span-1'
    }

    return (
        <div className={getColSpanClass()}>
            <Label
                htmlFor={field.name}
                className="block text-sm font-bold leading-6 text-gray-900"
            >
                {field.label}
            </Label>
            <div className="mt-2">
                {renderField()}
                {error?.message && (
                    <p className="mt-2 text-sm font-medium text-red-400">
                        {error.message as string}
                    </p>
                )}
            </div>
        </div>
    )
}