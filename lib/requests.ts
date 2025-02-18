import mivita from "./axiosMivita";
import { Opportunity } from "@/types/opportunityType";
import { Contact } from "@/types/contactType";

export async function GetOpportunities(id: string): Promise<Opportunity | undefined> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.get(
      `opportunities/?id=${id}`,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64"),
        },
      }
    );
    return response.data.opportunities[0];
  } catch (error) {
    console.error("Erro ao obter as oportinidades", error);
    // throw new Error("Falha ao obter as oportunidades.");
  }
}

export async function GetContacts(ContactId: string): Promise<Contact> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const body = {
      locationId: process.env.NEXT_PUBLIC_LOCATION_ID_MIVITA,
      pageLimit: 1,
      page: 1
    };
    const response = await mivita.get(
      "/contacts/?id=" + ContactId,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")
        },
        data: body
      }
    );
    return response.data.contact;
  } catch (error) {
    console.error("Erro ao obter os contatos", error);
    throw new Error("Falha ao obter os contatos.");
  }
}
