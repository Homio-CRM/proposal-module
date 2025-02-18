export type Opportunity = {
    contactId: string;
    name: string;
    customFields: {
      id: string;
      fieldValueString: string;
      fieldValueArray: string[];
    }[];
  };