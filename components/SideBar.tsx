import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

import { Building2, FilePlus2 } from 'lucide-react';
import { Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"



const SideBar = () => {
  return (
    <div className='bg-gradient-to-b from-purple-300 to-blue-300 h-full fixed top-0 left-0 w-20 p-4'>
        <Image width={48} height={48} src='LOGO HOMIO.svg' alt='Homio Logo'></Image>
        <div className='flex flex-col place-content-center mt-8 gap-4'>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                  <Link href="/" className='py-2 bg-indigo-900 rounded-md flex place-content-center hover:transition-all hover:bg-indigo-800'>
                    <Building2  size={24} className='text-white'/>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Empreendimentos</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger>
                  <Link href="/proposals" className='py-2 bg-indigo-900 rounded-md  text-center flex place-content-center  hover:transition-all hover:bg-indigo-800'>
                    <FilePlus2  className='text-white back'/>
                  </Link>   
                </TooltipTrigger>
                <TooltipContent>
                  <p>Propostas</p>
                </TooltipContent>
            </Tooltip>
             
          </TooltipProvider>  
         
        </div>
    </div>
  )
}

export default SideBar