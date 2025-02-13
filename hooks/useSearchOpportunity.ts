import { GetOpportunities } from "@/lib/requests"


export const useSearchOpportunity = async (opportunityId: string): Promise<object | undefined> => {
  try {
    const data = await GetOpportunities(opportunityId)
    return data
    console.log(data)
  } catch (error) {
    console.error('Erro ao buscar oportunidade:', error)
  }
}