import React, { Suspense } from 'react'
import Form from '@/components/Form'

const proposals = async () => {

  return (
    <div className='mt-24 ml-28 font-bold'>
      <Suspense fallback="Carregando">
        <Form />
      </Suspense>
    </div >

  )
}

export default proposals