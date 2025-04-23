import React, { Suspense } from 'react'
import Form from '@/components/Form'


export default function Home() {
  return (
    <div className='mt-6 mx-14 font-bold'>
      <Suspense fallback={<div>Carregando formulário...</div>}>
        <Form />
      </Suspense>
    </div >
  )

}
