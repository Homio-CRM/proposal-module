import React from 'react'
import Form from '@/components/Form'
import { getOpportunities } from '@/lib/requests';

const proposals = async () => {
  const opportunity = await getOpportunities('AUqyVuQlzu7fAFupcoNl');
  console.log(opportunity);
  return (
    <div className='mt-24 ml-28 font-bold'>
      <h1 className='text-gray-900 text-3xl'>Criar nova proposta</h1>

      <Form />
    </div>

  )
}

export default proposals