import mivita from "./axiosMivita";
import directus from "./axiosDirectus";
import { Opportunity } from "@/types/opportunityType";
import { Contact } from "@/types/contactType";
import { FormDataSchema } from "@/types/formSchema";
import { z } from 'zod'

type proposalSchema = z.infer<typeof FormDataSchema>

export async function getOpportunities(id: string): Promise<Opportunity | undefined> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.get(
      `opportunities/?id=${id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`,
        },
      }
    );
    return response.data.opportunities[0];
  } catch (error) {
    console.error("Erro ao obter as oportinidades", error);
    throw new Error("Falha ao obter as oportunidades.");
  }
}

export async function getContacts(ContactId: string): Promise<Contact> {
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
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
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

export async function postNoteToHomio(proposal: proposalSchema, totalProposalValue: number) {
  try {
    const body = {
      "homioOpportunityId": proposal.opportunityId,
      "proposalDate": proposal.proposalDate,
      "installments": proposal.installments.map((installment) => {
        return {
          "type": installment.type,
          "installmentsValue": installment.installmentsValue,
          "amount": installment.amount,
          "totalValue": installment.totalValue,
          "paymentDate": installment.paymentDate
        };
      }),
      "totalProposalValue": totalProposalValue
    };
    const response = await mivita.post(
      "/proposal-to-homio",
      body,
      {
        headers: {

        }
      }
    );
    return response
  } catch (error) {
    console.error("Erro ao postar a nota", error);
    throw new Error("Falha ao postar a nota.");
  }
}

export async function postProposal(proposal: proposalSchema) {
  try {
    const body = {
      "proposalDate": proposal.proposalDate,
      "building": proposal.building,
      "apartmentUnity": proposal.apartmentUnity,
      "floor": proposal.floor,
      "tower": proposal.tower,
      "vendor": proposal.vendor,
      "reserved": proposal.reservedUntill || null,
      "observations": proposal.observations,
      "contractDate": proposal.contractDate,
      "installments": proposal.installments.map((installment) => {
        return {
          "type": installment.type,
          "installmentsValue": installment.installmentsValue,
          "amount": installment.amount,
          "totalValue": installment.totalValue,
          "paymentDate": installment.paymentDate
        };
      }),
      "homioOpportunityId": proposal.opportunityId
    };
    const response = await directus.post(
      "/mivita_module_proposals",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_AUTHORIZATION_CODE}`
        }
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao postar a proposta", error);
    throw new Error("Falha ao postar a proposta.");
  }
}

export async function postContact(contactId: string, contact: proposalSchema) {
  try {
    const body = {
      "name": contact.name,
      "cpf": contact.cpf,
      "rg": contact.rg,
      "nationality": contact.nationality,
      "maritalStatus": contact.maritalStatus,
      "birthDate": contact.birthDate,
      "email": contact.email,
      "phone": contact.phone,
      "address": contact.address,
      "zipCode": contact.zipCode,
      "city": contact.city,
      "neighborhood": contact.neighborhood,
      "state": contact.state,
      "spouseName": contact.spouseName,
      "spouseCpf": contact.spouseCpf,
      "spouseRg": contact.spouseRg,
      "spouseNationality": contact.spouseNationality,
      "spouseOccupation": contact.spouseOccupation,
      "spouseEmail": contact.spouseEmail,
      "spousePhone": contact.spousePhone,
      "homioContactId": contactId,
    };
    const response = await directus.post(
      "/mivita_module_contacts",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_AUTHORIZATION_CODE}`
        },
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao postar o contato", error);
    throw new Error("Falha ao postar o contato.");
  }
}


export async function postConnection(contactId: string, proposalId: string) {
  try {
    const body = {
      "mivita_module_contacts_id": contactId,
      "mivita_module_proposals_id": proposalId
    };
    const response = await directus.post(
      "/mivita_module_contacts_mivita_module_proposals",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_AUTHORIZATION_CODE}`
        },
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao postar o contato", error);
    throw new Error("Falha ao postar o contato.");
  }
}

export async function patchContact(registerId: string, contact: proposalSchema) {
  try {
    const body = {
      "name": contact.name,
      "cpf": contact.cpf,
      "rg": contact.rg,
      "nationality": contact.nationality,
      "maritalStatus": contact.maritalStatus,
      "birthDate": contact.birthDate,
      "email": contact.email,
      "phone": contact.phone,
      "address": contact.address,
      "zipCode": contact.zipCode,
      "city": contact.city,
      "neighborhood": contact.neighborhood,
      "state": contact.state,
      "spouseName": contact.spouseName,
      "spouseCpf": contact.spouseCpf,
      "spouseRg": contact.spouseRg,
      "spouseNationality": contact.spouseNationality,
      "spouseOccupation": contact.spouseOccupation,
      "spouseEmail": contact.spouseEmail,
      "spousePhone": contact.spousePhone,
    };
    const response = await directus.patch(
      `/mivita_module_contacts/${registerId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_AUTHORIZATION_CODE}`
        },
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao postar o contato", error);
    throw new Error("Falha ao postar o contato.");
  }
}

export async function patchProposal(registerId: string, proposal: proposalSchema) {
  try {
    const body = {
      "proposalDate": proposal.proposalDate,
      "building": proposal.building,
      "apartmentUnity": proposal.apartmentUnity,
      "floor": proposal.floor,
      "tower": proposal.tower,
      "vendor": proposal.vendor,
      "reserved": proposal.reservedUntill || null,
      "observations": proposal.observations,
      "contractDate": proposal.contractDate,
      "installments": proposal.installments.map((installment) => {
        return {
          "type": installment.type,
          "installmentsValue": installment.installmentsValue,
          "amount": installment.amount,
          "totalValue": installment.totalValue,
          "paymentDate": installment.paymentDate
        };
      })
    };
    const response = await directus.patch(
      `/mivita_module_proposals/${registerId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_AUTHORIZATION_CODE}`
        }
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao postar a proposta", error);
    throw new Error("Falha ao postar a proposta.");
  }
}

export async function getContact(contactId: string) {
  try {
    const response = await directus.get(
      `/mivita_module_contacts?filter[homioContactId][_eq]=${contactId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_AUTHORIZATION_CODE}`
        },
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao pegar o contato", error);
    throw new Error("Falha ao pegar o contato.");
  }
}

export async function getProposal(opportunityId: string) {
  try {
    const response = await directus.get(
      `/mivita_module_proposals?filter[homioOpportunityId][_eq]=${opportunityId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_AUTHORIZATION_CODE}`
        },
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao pegar o contato", error);
    throw new Error("Falha ao pegar o contato.");
  }
}
