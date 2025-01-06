import React from 'react'

type TitleBarProps = {
    text: string,
}

const TitleBar = ({text} :TitleBarProps) => {
  return (
    <div className='bg-gray-0 w-full p-4 h-fit fixed top-0 left-20'>
        <h1 className='text-gray-900 font-bold text-2xl ml-4'>{text}</h1>
    </div>
  )
}

export default TitleBar