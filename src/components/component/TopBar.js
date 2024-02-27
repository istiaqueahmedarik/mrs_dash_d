import Image from 'next/image'
import React from 'react'

function TopBar() {
  return (
    <div   className='bg-transparent  flex flex-row justify-center text-4xl font-bold m-5 text-center'>
        <Image src='/logo.jpg' className='rounded-full mr-2' alt='logo' width={100} height={100}/>
        <div className='grid place-content-center ml-2'>

        <h1 className='ml-auto mr-auto'>Mongol Barota - MIST Mars Rover Society</h1>
        </div>
    </div>
  )
}

export default TopBar