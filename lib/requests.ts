import mivita from "./axiosMivita";
import { Opportunity } from "@/types/opportunityType";
import { Contact } from "@/types/contactType";
import { Proposal } from "@/types/proposalType";
import { FormDataSchema } from "@/types/formSchema";
import { z } from 'zod'
import { Units } from "@/types/unitType";

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
    console.error("Erro ao obter a oportinidade", error);
    throw new Error("Falha ao obter a oportunidade.");
  }
}

export async function getContacts(id: string): Promise<Contact> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.get(
      `contacts/?id=${id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        }
      }
    );
    return response.data.contact;
  } catch (error) {
    console.error("Erro ao obter o contato", error);
    throw new Error("Falha ao obter o contato.");
  }
}

export async function getProposal(id: string): Promise<Proposal | undefined> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.get(
      `proposals/list/?id=${id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        }
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao obter a proposta", error);
    throw new Error("Falha ao obter a proposta.");
  }
}

export async function getDevelopment(id: string): Promise<Proposal> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.get(
      `developments/?id=${id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        }
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao obter o empreendimento", error);
    throw new Error("Falha ao obter o empreendimento.");
  }
}

export async function getUnit(id: string): Promise<Proposal> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.get(
      `units/?id=${id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        }
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao obter a unidade", error);
    throw new Error("Falha ao obter a unidade.");
  }
}

export async function getAvailablesUnits(): Promise<Units> {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.get(
      `units/availables`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        }
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao obter as unidades disponiveis", error);
    throw new Error("Falha ao obter as unidades disponiveis.");
  }
}

export async function postSpouseContact(contact: proposalSchema) {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const body = {
      "name": contact.spouseName,
      "cpf": contact.spouseCpf,
      "rg": contact.spouseRg,
      "nationality": contact.spouseNationality,
      "email": contact.spouseEmail,
      "phone": contact.spousePhone,
      "occupation": contact.spouseOccupation,
      "address": contact.spouseAddress,
      "zipCode": contact.spouseZipCode,
      "city": contact.spouseCity,
      "neighborhood": contact.spouseNeighborhood,
      "state": contact.spouseState
    };
    const response = await mivita.post(
      "contacts",
      body,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        },
        data: body
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao postar o contato", error);
    throw new Error("Falha ao postar o contato.");
  }
}

export async function patchMainContact(contact: proposalSchema) {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
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
      "occupation": contact.occupation,
      "city": contact.city,
      "neighborhood": contact.neighborhood,
      "state": contact.state
    };
    const response = await mivita.patch(
      `contacts?id=${contact.mainContactId}`,
      body,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        },
        data: body
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar o contato principal", error);
    throw new Error("Falha ao atualizar o contato principal");
  }
}

export async function patchSpouseContact(contact: proposalSchema) {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const body = {
      "name": contact.spouseName,
      "cpf": contact.spouseCpf,
      "rg": contact.spouseRg,
      "nationality": contact.spouseNationality,
      "email": contact.spouseEmail,
      "phone": contact.spousePhone,
      "occupation": contact.spouseOccupation,
      "address": contact.spouseAddress,
      "zipCode": contact.spouseZipCode,
      "city": contact.spouseCity,
      "neighborhood": contact.spouseNeighborhood,
      "state": contact.spouseState
    };
    const response = await mivita.patch(
      `contacts?id=${contact.spouseContactId}`,
      body,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        },
        data: body
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar o contato conjuge", error);
    throw new Error("Falha ao atualizar o contato conjuge.");
  }
}

export async function postRelation(opportunityId: string, contactId: string) {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const body = {
      "opportunityId": opportunityId,
      "spouseId": contactId
    };
    const response = await mivita.post(
      "relations",
      body,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        },
        data: body
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar a oportunidade", error);
    throw new Error("Falha ao atualizar a oportunidade.");
  }
}

export async function postProposal(proposal: proposalSchema, totalProposalValue: number) {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const body = {
      "opportunityName": proposal.opportunityName,
      "proposalDate": proposal.proposalDate,
      "building": proposal.building,
      "apartmentUnity": proposal.apartmentUnity,
      "floor": proposal.floor,
      "tower": proposal.tower,
      "vendor": proposal.vendor,
      "reserved": proposal.reservedUntill,
      "observations": proposal.observations,
      "installments": proposal.installments.map((installment) => {
        return {
          "type": installment.type,
          "installmentsValue": installment.installmentsValue,
          "amount": installment.amount,
          "totalValue": (parseFloat(installment.installmentsValue) * installment.amount),
          "paymentDate": installment.paymentDate
        };
      }),
      "totalProposalValue": totalProposalValue,
      "homioOpportunityId": proposal.opportunityId,
      "mainContactId": proposal.mainContactId,
      "spouseContactId": proposal.spouseContactId
    };
    const response = await mivita.post(
      "proposals",
      body,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        },
        data: body
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao criar a proposta", error);
    throw new Error("Falha ao criar a proposta.");
  }
}

export async function patchProposal(proposal: proposalSchema, totalProposalValue: number) {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const body = {
      "opportunityName": proposal.opportunityName,
      "proposalDate": proposal.proposalDate,
      "building": proposal.building,
      "apartmentUnity": proposal.apartmentUnity,
      "floor": proposal.floor,
      "tower": proposal.tower,
      "vendor": proposal.vendor,
      "reserved": proposal.reservedUntill,
      "observations": proposal.observations,
      "installments": proposal.installments.map((installment) => {
        return {
          "type": installment.type,
          "installmentsValue": installment.installmentsValue,
          "amount": installment.amount,
          "totalValue": (parseFloat(installment.installmentsValue) * installment.amount),
          "paymentDate": installment.paymentDate
        };
      }),
      "totalProposalValue": totalProposalValue,
      "homioOpportunityId": proposal.opportunityId,
      "mainContactId": proposal.mainContactId,
      "spouseContactId": proposal.spouseContactId
    };
    const response = await mivita.patch(
      `proposals/update?id=${proposal.proposalId}`,
      body,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        },
        data: body
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar a proposta", error);
    throw new Error("Falha ao atualizar a proposta.");
  }
}

export async function patchOpportunity(proposal: proposalSchema) {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const body = {
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
    const response = await mivita.patch(
      `opportunities?id=${proposal.opportunityId}`,
      body,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        },
        data: body
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar a oportunidade", error);
    throw new Error("Falha ao atualizar a oportunidade.");
  }
}

export async function updateUnitStatus(proposal: proposalSchema) {
  try {
    const USERNAME = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_PASS;
    const response = await mivita.patch(
      `units/status?id=${proposal.apartmentUnity}`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`
        }
      }
    );
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar a unidade", error);
    throw new Error("Falha ao atualizar a unidade.");
  }
}