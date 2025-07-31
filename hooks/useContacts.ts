'use client'

import { UseFormSetValue } from 'react-hook-form'
import { getContacts } from '@/lib/requests'
import { Contact } from '@/types/contactType'
import { checkCpf, checkCep } from '@/lib/validations'
import { formatDateForInput } from '@/utils/masks'

export function useContacts(setValue: UseFormSetValue<any>) {
    const searchContacts = async (mainContactId: string, spouseContactId: string | undefined) => {
        const contact = await getContacts(mainContactId)
        const spouse = spouseContactId ? await getContacts(spouseContactId) : null
        updateContactsLabels(contact, spouse)
    }

    const updateContactsLabels = (contact: Contact, spouse: Contact | null) => {
        setValue("mainContactId", contact.id)
        setValue("name", `${contact.firstName} ${contact.lastName}`)
        setValue(
            "cpf",
            checkCpf(contact.customFields.find(item => item.id === 'Z6NSHw77VAORaZKcAQr9')?.value as string)
        )
        setValue("rg", contact.customFields.find(item => item.id === 'JZZb9gPOSISid1vp3rHh')?.value as string)
        setValue("nationality", contact.customFields.find(item => item.id === '1Xj4odQLI2L5FsXT5jmO')?.value as string)
        setValue(
            "maritalStatus",
            contact.customFields.find(item => item.id === 'a5b5vH65cVyb9QxUF5ef')?.value as
            | "Solteiro(a)"
            | "Casado(a)"
            | "Separado(a)"
            | "Divorciado(a)"
            | "Viúvo(a)"
            | "União Estável"
        )
        setValue("birthDate", contact.dateOfBirth ? formatDateForInput(contact.dateOfBirth) : '')
        setValue("email", contact.email)
        setValue("phone", contact.phone)
        setValue("address", contact.address1)
        setValue("zipCode", checkCep(contact.postalCode))
        setValue("city", contact.city)
        setValue("state", contact.state)
        setValue("neighborhood", contact.customFields.find(item => item.id === 'BppzAoRqxsTWpdFcJwam')?.value as string)
        setValue("apartmentUnity", contact.customFields.find(item => item.id === 'stOGiUa4CDw4mxbo03kU')?.value as string)
        setValue("floor", contact.customFields.find(item => item.id === '65p4lHnuDMqJFeX2iMBI')?.value as string)
        setValue("tower", contact.customFields.find(item => item.id === 'CH2ojxtTvuVhbYxzpyME')?.value as string)
        setValue("reservedUntill", contact.customFields.find(item => item.id === 'jQI7mltRg2JulEJZUYwc')?.value)
        setValue("observations", contact.customFields.find(item => item.id === 'DcFDxA1BhIzMbpedd8Jc')?.value)

        if (spouse) {
            setValue("spouseContactId", spouse.id)
            setValue("spouseName", `${spouse.firstName} ${spouse.lastName}`)
            setValue(
                "spouseCpf",
                checkCpf(spouse.customFields.find(item => item.id === 'Z6NSHw77VAORaZKcAQr9')?.value as string)
            )
            setValue("spouseRg", spouse.customFields.find(item => item.id === 'JZZb9gPOSISid1vp3rHh')?.value)
            setValue("spouseNationality", spouse.customFields.find(item => item.id === '1Xj4odQLI2L5FsXT5jmO')?.value)
            setValue("spouseOccupation", spouse.customFields.find(item => item.id === 'DJAJ8ugEhcq6am3ywUBU')?.value)
            setValue("spouseEmail", spouse.email)
            setValue("spousePhone", spouse.phone)
            setValue(
                "spouseMaritalStatus",
                spouse.customFields.find(item => item.id === 'a5b5vH65cVyb9QxUF5ef')?.value as
                | "Solteiro(a)"
                | "Casado(a)"
                | "Separado(a)"
                | "Divorciado(a)"
                | "Viúvo(a)"
                | "União Estável"
            )
            setValue("spouseAddress", spouse.address1)
            setValue("spouseZipCode", checkCep(spouse.postalCode))
            setValue("spouseCity", spouse.city)
            setValue("spouseNeighborhood", spouse.customFields.find(item => item.id === 'BppzAoRqxsTWpdFcJwam')?.value as string)
            setValue("spouseState", spouse.state)
        }
    }

    return {
        searchContacts,
        updateContactsLabels
    }
}