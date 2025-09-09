import { Installment } from "@/types/installmentType"

export function checkCpf(cpf: string): string {
  if (cpf && /^.{11,14}$/.test(cpf)) {
    cpf = cpf.toString().replace(/\D/g, '')
    cpf = cpf.toString().replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }
  return cpf
}

export function checkCep(cep: string): string {
  if (cep && cep.replace(/\D/g, '').length === 8) {
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2')
  }
  else {
    return cep
  }
}

export function checkPaymentFlow(paymentFlow: string): Installment[] {
  const data = paymentFlow.replace('Parcelas:', '').trim();

  // Divide a string pelos delimitadores (linhas de traços)
  const blocks = data.split('---------------------------').filter(block => block.trim());

  return blocks.map(block => {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);

    // Inicializa com valores padrão para garantir que o objeto tem os campos obrigatórios
    const installment: Installment = {
      type: 'Sinal',
      installmentsValue: '',
      amount: 0,
      paymentDate: ''
    };

    lines.forEach(line => {
      const parts = line.split(':').map(part => part.trim());
      if (parts.length < 2) return; // ignora se a linha não estiver no formato chave: valor

      const key = parts[0];
      const value = parts.slice(1).join(':');

      if (/^parcela\s*\d*$/i.test(key)) return;

      if (key === 'Tipo') {
        installment.type = value as
          'Sinal'
          | 'Parcela única'
          | 'Financiamento'
          | 'Mensais'
          | 'Intermediárias'
          | 'Anuais'
          | 'Semestrais'
          | 'Bimestrais'
          | 'Trimestrais';
      } else if (key === 'Valor da Parcela') {
        installment.installmentsValue = value;
      } else if (key === 'Quantidade') {
        installment.amount = Number(value);
      } else if (key === 'Data do Pagamento') {
        installment.paymentDate = value;
      }
    });
    return installment;
  });
}

export function formatCpfInput(input: string): string {
  const digits = (input || '').replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) {
    return digits
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

export function formatCepInput(input: string): string {
  const digits = (input || '').replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) {
    return digits.length === 5 ? `${digits}-` : digits
  }
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
}