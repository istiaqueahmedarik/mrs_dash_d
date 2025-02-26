import React from 'react'
import Science from '../../components/component/science'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Basic from '../../components/component/basic_sensor'
import Rock from '@/components/component/Rock'
import Life from '@/components/component/Life'

function page() {
  return (
    <div className='w-screen  mx-auto grid place-content-center text-white'>
      {/* <Science /> */}
      <Tabs defaultValue="basic" className="w-screen p-100">
        <TabsList className='flex justify-center bg-transparent'>
          <TabsTrigger value="basic">Sensory Feedback</TabsTrigger>
          <TabsTrigger value="chemical">Chemical Test</TabsTrigger>
          <TabsTrigger value="rock">Rock</TabsTrigger>

        </TabsList>
        <TabsContent value="basic">
          <Basic/>
        </TabsContent>
        <TabsContent value="chemical">
          <Life/>
        </TabsContent>
        <TabsContent value="rock">
          <Rock/>
        </TabsContent>
        
      </Tabs>

    
    </div>
  )
}

export default page