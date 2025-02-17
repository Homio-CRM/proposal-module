import { GetOpportunities } from "@/lib/requests"
import { GetContacts } from "@/lib/requests"




export const useSearchOpportunity = async (opportunityId: string): Promise<Opportunity | undefined> => {
  try {
    const data = await GetOpportunities(opportunityId)

    if (!data || !data.opportunities || data.opportunities.length === 0) {
      throw new Error("Nenhuma oportunidade encontrada")
    }

    const opportunity = data.opportunities[0]

    return {
      contactId: opportunity.contactId,
      name: opportunity.name,
      email: opportunity.contact?.email || "",
    };
  } catch (error) {
    console.error("Erro ao buscar oportunidade:", error)
  }
}


export const useSearchContact = async (contactId: string): Promise<object | undefined> => {
  try {
    const data = await GetContacts(contactId)
    return data
  } catch (error) {
    console.error('Erro ao buscar contato:', error)
  }
}