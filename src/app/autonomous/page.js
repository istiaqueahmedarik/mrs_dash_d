'use client'
import React from 'react'
import Autonomus from '../../components/component/Autonomus'
import dynamic from 'next/dynamic'

function Page() {
  const GPSTracker = dynamic(() => import('../../../gps-tracker'), {
    ssr: false
  })
  return (
    <div className='h-screen w-screen ml-[5rem]'>
      <Autonomus />
    </div>
  )
}

export default Page