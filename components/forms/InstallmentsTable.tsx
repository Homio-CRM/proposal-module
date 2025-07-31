'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UseFormRegister, useFieldArray, Control, UseFormWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'

interface InstallmentsTableProps {
    register: UseFormRegister<any>
    control: Control<any>
    watch: UseFormWatch<any>
    delta: number
    isLoading: boolean
}

const installmentTypes = [
    { value: "Sinal", label: "Sinal" },
    { value: "Parcela única", label: "Parcela única" },
    { value: "Financiamento", label: "Financiamento" },
    { value: "Mensais", label: "Mensais" },
    { value: "Intermediárias", label: "Intermediárias" },
    { value: "Anuais", label: "Anuais" },
    { value: "Semestrais", label: "Semestrais" },
    { value: "Bimestrais", label: "Bimestrais" },
    { value: "Trimestrais", label: "Trimestrais" }
]

export function InstallmentsTable({ register, control, watch, delta, isLoading }: InstallmentsTableProps) {
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [selectAll, setSelectAll] = useState<boolean>(false)

    const { fields, append, remove } = useFieldArray({
        control,
        name: "installments",
    })

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([])
        } else {
            setSelectedRows(fields.map((_, index) => index))
        }
        setSelectAll(!selectAll)
    }

    const toggleRowSelection = (index: number) => {
        setSelectedRows((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        )
    }

    const handleDeleteSelected = () => {
        remove(selectedRows)
        setSelectedRows([])
        setSelectAll(false)
    }

    const calculateTotal = () => {
        return (watch("installments") || []).reduce((acc: number, curr: any) => {
            const value = (parseFloat(curr.installmentsValue?.replace('.', '').replace(',', '.')) || 0) * (Number(curr.amount) || 0)
            return acc + value
        }, 0)
    }

    return (
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-4"
        >
            {isLoading && <div className="text-center">Carregando...</div>}

            <div className="w-full flex justify-end">
                <Button
                    type="button"
                    onClick={() => append({ type: "Sinal", totalValue: "", amount: 1, installmentsValue: "", paymentDate: "" })}
                    className="bg-indigo-500 hover:bg-indigo-600"
                >
                    + Nova Parcela
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-12">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                    className="scale-125"
                                />
                            </TableHead>
                            <TableHead className="font-semibold">Condição</TableHead>
                            <TableHead className="font-semibold">Valor das parcelas</TableHead>
                            <TableHead className="font-semibold">Qnt. de Parcelas</TableHead>
                            <TableHead className="font-semibold">Valor total</TableHead>
                            <TableHead className="font-semibold">Data</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(index)}
                                        onChange={() => toggleRowSelection(index)}
                                        className="scale-125"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={watch(`installments.${index}.type`)}
                                        onValueChange={(value: string) => {
                                            const event = { target: { value } }
                                            register(`installments.${index}.type`).onChange(event)
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-gray-50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {installmentTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <span className="text-gray-900 font-medium mr-1">R$</span>
                                        <Input
                                            type="text"
                                            className="border-0 bg-transparent p-1 focus-visible:ring-0"
                                            {...register(`installments.${index}.installmentsValue`)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        className="border-0 bg-transparent p-1 focus-visible:ring-0"
                                        {...register(`installments.${index}.amount`, { valueAsNumber: true })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="text"
                                        value={
                                            (parseFloat(watch(`installments.${index}.installmentsValue`)?.replace('.', '').replace(',', '.')) || 0) *
                                            (Number(watch(`installments.${index}.amount`)) || 0)
                                        }
                                        readOnly
                                        className="border-0 bg-transparent p-1 focus-visible:ring-0"
                                        {...register(`installments.${index}.totalValue`)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="date"
                                        className="border-0 bg-transparent p-1 focus-visible:ring-0"
                                        {...register(`installments.${index}.paymentDate`)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6} className="bg-gray-50">
                                <div className="flex items-center text-gray-600 font-medium">
                                    <span>VALOR TOTAL:</span>
                                    <span className="ml-4">R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            <div className="flex gap-4">
                <Button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={selectedRows.length === 0}
                    variant="destructive"
                >
                    Excluir Selecionados
                </Button>
            </div>
        </motion.div>
    )
}