export type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    postalCode: string;
    city: string;
    state: string;
    dateOfBirth: string;
    customFields: {
      id: string;
      value: string;
    }[];
};