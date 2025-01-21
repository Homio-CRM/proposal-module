import React from 'react'
import Form from '@/components/Form'
import { getToken } from '@/lib/tokenManager';

const proposals = async () => {
  const token = await getToken();
  console.log(token);
  return (
    <>
      <h1 className='gray-900 text-5xl'>Criar nova proposta</h1>
      <div className='text-white'>proposals</div>
      <Form/>
    </>
  )
}

export default proposals