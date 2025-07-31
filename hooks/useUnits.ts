'use client'

import { useState, useEffect } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { getAvailablesUnits } from '@/lib/requests'
import { Unit } from '@/types/unitType'

type UnitOption = { value: string; label: string }

export function useUnits(setValue: UseFormSetValue<any>, watch: UseFormWatch<any>, currentUnit?: Unit) {
    const [isLoadingUnits, setIsLoadingUnits] = useState(false)
    const [allUnits, setAllUnits] = useState<Unit[]>([])
    const [filteredUnits, setFilteredUnits] = useState<UnitOption[]>([])

    const selectedBuilding = watch('building')

    useEffect(() => {
        loadUnits()
    }, [])

    useEffect(() => {
        if (!selectedBuilding) {
            setFilteredUnits([])
            return
        }

        if (!isLoadingUnits) {
            if (currentUnit) {
                if (!allUnits.find(item => item.id === currentUnit?.id)) {
                    setAllUnits(allUnits.concat(currentUnit))
                }
                setValue("apartmentUnity", currentUnit.id)
            }
            setFilteredUnits(
                allUnits
                    .filter(u => u.development === selectedBuilding)
                    .map(u => ({ value: u.id, label: u.name }))
            )
        }
    }, [selectedBuilding, allUnits, currentUnit, isLoadingUnits, setValue])

    const loadUnits = async () => {
        setIsLoadingUnits(true)
        try {
            const availableUnits = await getAvailablesUnits()
            setAllUnits(availableUnits.units)
        } finally {
            setIsLoadingUnits(false)
        }
    }

    return {
        isLoadingUnits,
        allUnits,
        filteredUnits,
        loadUnits
    }
}