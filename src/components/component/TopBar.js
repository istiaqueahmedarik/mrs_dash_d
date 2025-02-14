'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import React from 'react'

function TopBar() {
  const pathname = usePathname();
  return (
    <div   className='bg-transparent  flex flex-row justify-center text-4xl font-bold m-5 text-center text-white'>
        <Image src='/logo.jpg' className='rounded-full mr-2' alt='logo' width={100} height={100}/>
        <div className='grid place-content-center ml-2'>

        <h1 className='ml-auto mr-auto'>Mongol Barota - {pathname === '/autonomous' ? 'Autonomous Dashboard' :'MIST Mars Rover Team'}</h1>
        </div>
    </div>
  )
}

export default TopBar