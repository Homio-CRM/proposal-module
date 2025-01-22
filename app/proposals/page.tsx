import React from 'react'
import Form from '@/components/Form'
import { getToken } from '@/lib/tokenManager';

const proposals = async () => {
  const token = await getToken();
  console.log(token);

  return (
    <div className='mt-24 ml-28 font-bold'>
      <h1 className='text-gray-900 text-3xl'>Criar nova proposta</h1>

      <Form />
    </div>

  )
}

export default proposals