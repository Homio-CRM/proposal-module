import mivita from "./axiosMivita";

export async function GetOpportunities(id: string): Promise<object | undefined> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.get<object>(
      `opportunities/?id=${id}`,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64"),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao obter as oportinidades", error);
    // throw new Error("Falha ao obter as oportunidades.");
  }
}

export async function GetContacts(ContactId: string): Promise<object> {
  try {
    const USERNAME = process.env.HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.HOMIO_API_MIVITA_PASS;
    const body = {
      locationId: process.env.LOCATION_ID_MIVITA,
      pageLimit: 1,
      page: 1
    };
    const response = await mivita.get<object>(
      "/contacts/?id=" + ContactId,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")
        },
        data: body
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao obter os contatos", error);
    throw new Error("Falha ao obter os contatos.");
  }
}
