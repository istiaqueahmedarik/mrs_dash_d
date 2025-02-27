'use client'
import React from 'react'
import Autonomus from '../../components/component/Autonomus'
import dynamic from 'next/dynamic'
import MapComponent from '@/components/MapComponent'

function Page() {
  
  return (
    <div className='h-screen w-screen ml-[5rem]'>

    <Autonomus />
    </div>
  )
}

export default Page