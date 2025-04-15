export type Installment = {
    type: 'Sinal'
            |'Parcela única'
            | 'Financiamento'
            | 'Mensais'
            | 'Intermediárias'
            | 'Anuais'
            | 'Semestrais'
            |'Bimestrais'
            | 'Trimestrais';
    installmentsValue: string;
    amount: number;
    paymentDate: string;
}