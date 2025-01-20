import React from 'react'
import Form from '@/components/Form'
import { getOrCreateToken } from '@/lib/auth'
import { getOpportunities } from '@/lib/requests'

const proposals = async () => {
  const token = await getOrCreateToken()
  // console.log(token)
  const opportunities = await getOpportunities('r1WbsHpPmrnXFXw4bJbc', token)
  console.log(opportunities)
  return (
    <div className='mt-24 ml-28 font-bold'>
      <h1 className='text-gray-900 text-3xl'>Criar nova proposta</h1>
      <Form />
    </div>

  )
}

export default proposals