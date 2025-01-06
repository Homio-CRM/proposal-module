import React from 'react'

type TitleBarProps = {
    text: string,
}

const TitleBar = ({text} :TitleBarProps) => {
  return (
    <div className='bg-gray-0 w-full p-4 h-fit'>
        <h1 className='text-gray-900 font-bold text-lg '>{text}</h1>
    </div>
  )
}

export default TitleBar