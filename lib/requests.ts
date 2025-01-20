import { getOrCreateToken } from '@/lib/auth'
import homio from "./axios";

export async function getOpportunities(opportunityId: string, token: string): Promise<object> {
    
    try {
        const response = await homio.get<object>(
          "/opportunities/" + opportunityId,
          {
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer " + token,
                Version: "2021-07-28"
            },
          }
        );

        return response.data;
    } catch (error) {
        console.error("Erro ao obter as oportinidades", error);
        throw new Error("Falha ao obter as oportunidades.");
    }
}
