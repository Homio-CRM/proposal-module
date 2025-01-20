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
    <>
      <h1 className='gray-900 text-5xl'>Criar nova proposta</h1>
      <div className='text-white'>proposals</div>
      <Form/>
    </>
  )
}

export default proposals