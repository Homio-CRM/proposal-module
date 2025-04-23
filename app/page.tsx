import React from 'react'
import Form from '@/components/Form'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className='mt-6 mx-14 font-bold'>
      <Suspense fallback="Carregando">
        <Form />
      </Suspense>
    </div > 
  )
}
