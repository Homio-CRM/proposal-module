import React from 'react'
import Image from 'next/image'

const SideBar = () => {
  return (
    <div className='bg-gradient-to-b from-purple-300 to-blue-300 h-screen p-4'>
        <Image width={48} height={48} src='LOGO HOMIO.svg' alt='Homio Logo'></Image>

        <div>
            <span className="material-symbols-outlined">apartment</span>
            <span className="material-symbols-outlined">receipt_long</span>
        </div>
    </div>
  )
}

export default SideBar