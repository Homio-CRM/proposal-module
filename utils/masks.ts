export const applyCpfMask = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara XXX.XXX.XXX-XX
    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14) // Limita a 14 caracteres (incluindo pontos e hífen)
}

export const applyCepMask = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara XXXXX-XXX
    return numbers
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 9) // Limita a 9 caracteres (incluindo hífen)
}

export const applyPhoneMask = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara (XX) XXXXX-XXXX
    return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15) // Limita a 15 caracteres (incluindo parênteses, espaços e hífen)
}

export const applyDateMask = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara DD/MM/AAAA
    return numbers
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 10) // Limita a 10 caracteres (incluindo barras)
}

export const formatDateForInput = (dateString: string): string => {
    if (!dateString) return ''

    // Converte data do formato YYYY-MM-DD para DD/MM/AAAA
    // Usa UTC para evitar problemas de fuso horário
    const [year, month, day] = dateString.split('-')
    if (!year || !month || !day) return dateString

    return `${day}/${month}/${year}`
}

export const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return ''

    // Converte data do formato DD/MM/AAAA para YYYY-MM-DD
    const parts = dateString.split('/')
    if (parts.length !== 3) return dateString

    const day = parts[0].padStart(2, '0')
    const month = parts[1].padStart(2, '0')
    const year = parts[2]

    // Valida se é uma data válida
    const date = new Date(`${year}-${month}-${day}`)
    if (isNaN(date.getTime())) return dateString

    return `${year}-${month}-${day}`
} 