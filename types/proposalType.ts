export type Proposal = {
    id: string;
    properties: {
      name: string,
      date: string,
      responsable: string,
      observations: string,
      payment_flow: string,
      total_value: {
        value: number,
        currency: string
      },
      opportunity_id: string,
      reservation_date: string
    };
    relations: {
      id: string;
      relation: {
        key: string,
        value: string
      }[];
    }[];
};