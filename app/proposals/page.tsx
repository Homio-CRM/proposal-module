import React from 'react'
import Form from '@/components/Form'
import { getAccessToken } from '@/lib/auth'





const proposals = async () => {
  const token = await getAccessToken()
  console.log(token)
  return (
    <>
      <h1 className='gray-900 text-5xl'>Criar nova proposta</h1>
      <div className='text-white'>proposals</div>
      <Form/>
    </>
  )
}

export default proposals