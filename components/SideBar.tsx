import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

import { Building2, FilePlus2 } from 'lucide-react';


const SideBar = () => {
  return (
    <div className='bg-gradient-to-b from-purple-300 to-blue-300 h-screen p-4'>
        <Image width={48} height={48} src='LOGO HOMIO.svg' alt='Homio Logo'></Image>
        <div className='w-full flex flex-col place-content-center'>
            <Link href="/proposals" className='bg-indigo-900 p-2 rounded-md mt-4 '>
                <FilePlus2  className='text-white back'/>
            </Link>
            <Link href="/apartments" className='bg-indigo-900 p-2 rounded-md mt-4 '>
                <Building2 className='text-white back'/>
            </Link>
        </div>
    </div>
  )
}

export default SideBar