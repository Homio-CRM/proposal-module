'use client'

import { useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { getProposal, getDevelopment, getUnit } from '@/lib/requests'
import { Proposal } from '@/types/proposalType'
import { Unit } from '@/types/unitType'

export function useProposal(setValue: UseFormSetValue<any>) {
    const [isLoading, setIsLoading] = useState(false)
    const [currentUnit, setCurrentUnit] = useState<Unit>()

    const searchProposal = async (id: string) => {
        setIsLoading(true)
        try {
            const proposal = await getProposal(id)
            setValue("proposalId", id)

            if (!proposal) return

            const contactId = proposal.relations.find(item => item.id === "67fd417a21ba9077d3f1c0d4")?.relation.find(item => item.key !== "custom_objects.proposals")?.value as string
            const spouseId = proposal.relations.find(item => item.id === "67fd5faa21ba903a1b02131e")?.relation.find(item => item.key !== "custom_objects.proposals")?.value as string
            const developmentId = proposal.relations.find(item => item.id === "67fd413b8eba9e985167762a")?.relation.find(item => item.key !== "custom_objects.proposals")?.value as string
            const unitId = proposal.relations.find(item => item.id === "67fd604421ba90b14302635f")?.relation.find(item => item.key !== "custom_objects.proposals")?.value as string

            await searchDevelopmentAndUnit(developmentId, unitId)
            updateProposalLabels(proposal)

            return { contactId, spouseId }
        } finally {
            setIsLoading(false)
        }
    }

    const searchDevelopmentAndUnit = async (developmentId: string, unitId: string) => {
        const development = await getDevelopment(developmentId)
        const unit = await getUnit(unitId)
        updateDevelopmentLabels(development)

        const newUnit: Unit = {
            id: unit.id,
            name: unit.properties.name,
            development: development.properties.name
        }
        setCurrentUnit(newUnit)
    }

    const updateDevelopmentLabels = (development: Proposal) => {
        setValue(
            "building",
            development.properties.name as
            | "Serena By Mivita"
            | "Lago By Mivita"
            | "Stage Praia do Canto"
            | "Next Jardim da Penha"
            | "Inside Jardim da Penha"
            | "Quartzo By Mivita"
        )
    }

    const updateProposalLabels = (proposal: Proposal) => {
        setValue("opportunityId", proposal.properties.opportunity_id)
        setValue("opportunityName", proposal.properties.name)
        setValue("proposalDate", proposal.properties.date)
        setValue("vendor", proposal.properties.responsable)
        setValue("reservedUntill", proposal.properties.reservation_date)
        setValue("observations", proposal.properties.observations)
    }

    return {
        isLoading,
        currentUnit,
        searchProposal,
        searchDevelopmentAndUnit,
        updateProposalLabels
    }
}