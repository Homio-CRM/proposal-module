import React from 'react'
import Form from '@/components/Form'
import { GetOpportunities } from '@/lib/requests';
import { GetContacts } from '@/lib/requests';

const proposals = async () => {
  const opportunity = await GetOpportunities('AUqyVuQlzu7fAFupcoNl');
  console.log(opportunity);
  // const contact = await GetContacts('XB6C3FsgPmyRctL5Elap');
  // console.log(contact);
  return (
    <div className='mt-24 ml-28 font-bold'>
      <h1 className='text-gray-900 text-3xl'>Criar nova proposta</h1>

      <Form />
    </div>

  )
}

export default proposals