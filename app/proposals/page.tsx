import React, { Suspense } from 'react'
import Form from '@/components/Form'

const proposals = async () => {

  return (
    <div className='mt-24 ml-28 font-bold'>

      <Suspense fallback={<div>Carregando formulário...</div>}>

        <Form />
      </Suspense>
    </div >

  )
}

export default proposals