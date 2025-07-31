'use client'

import { useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { getOpportunities } from '@/lib/requests'
import { Opportunity } from '@/types/opportunityType'

export function useOpportunity(setValue: UseFormSetValue<any>, watch: UseFormWatch<any>) {
    const [isLoading, setIsLoading] = useState(false)

    const searchOpportunity = async () => {
        setIsLoading(true)
        try {
            const opportunity = await getOpportunities(watch('opportunityId'))
            if (!opportunity) return

            const contactId = opportunity.contactId
            const spouseId = opportunity.relations.find(item => item.recordId !== opportunity.contactId)?.recordId

            updateOpportunityLabels(opportunity)

            return { contactId, spouseId }
        } finally {
            setIsLoading(false)
        }
    }

    const updateOpportunityLabels = (opportunity: Opportunity) => {
        setValue(
            "building",
            opportunity.customFields?.find(item => item.id === 'EVdLCbbyeUrBrMIFmZVX')
                ?.fieldValueArray[0] as
            | "Serena By Mivita"
            | "Lago By Mivita"
            | "Stage Praia do Canto"
            | "Next Jardim da Penha"
            | "Inside Jardim da Penha"
            | "Quartzo By Mivita"
        )
        setValue(
            "vendor",
            opportunity.customFields.find(item => item.id === 'UxgoVhhSfTrIG9RFaUJ5')
                ?.fieldValueString as string
        )
        setValue("opportunityName", opportunity.name)
    }

    return {
        isLoading,
        searchOpportunity,
        updateOpportunityLabels
    }
}