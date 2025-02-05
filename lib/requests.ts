import mivita from "./axiosMivita";

export async function getOpportunities(opportunityId: string): Promise<object> {
    try {
      const USERNAME = process.env.HOMIO_API_MIVITA_USER;
      const PASSWORD = process.env.HOMIO_API_MIVITA_PASS;
      const response = await mivita.get<object>(
        "/opportunities/?id=" + opportunityId,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64"),
        },
      }
    );
      return response.data;
    } catch (error) {
        console.error("Erro ao obter as oportinidades", error);
        throw new Error("Falha ao obter as oportunidades.");
    }
}
