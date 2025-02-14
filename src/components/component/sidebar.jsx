'use client'
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { AtomIcon, BotIcon, HomeIcon, SettingsIcon, ZapIcon } from 'lucide-react'
import { motion } from 'framer-motion';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
function Sidebar() {
  const pathName = usePathname()
  console.log(pathName)
  return (
    <div  style={{gridArea: 'sidebar'}} className='z-10 fixed p-3'>
         <motion.div
        animate={{
          opacity: 1,
          x: 0,
        }}
        className="flex flex-col items-center justify-between w-16 h-full p-4 border border-[#B9ABA7] border-spacing-1 bg-white/10 backdrop-blur-md rounded-full"
        initial={{
          opacity: 0,
          x: -100,
         
        }}
        transition={{
          duration: 1,
        }}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={"/"}  className={`hover:bg-[#6F5D81] hover:text-white p-2 hover:rounded-full m-6 ${pathName==='/'?" text-white rounded-full bg-[#6F5D81]":""}`} >
                <HomeIcon className="hover:text-white  text-[#B9ABA7] " />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Home</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/science"  className={`hover:bg-[#6F5D81] hover:text-white p-2 hover:rounded-full m-6 ${pathName==='/science'?" text-white rounded-full bg-[#6F5D81]":""}`} >
                <AtomIcon className="hover:text-white text-[#B9ABA7] " />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Science</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/electrical" className={`hover:bg-[#6F5D81] hover:text-white p-2 hover:rounded-full m-6 ${pathName==='/electrical'?" text-white rounded-full bg-[#6F5D81]":""}`} >
                <ZapIcon className="hover:text-white text-[#B9ABA7] " />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Electrical</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link className={`hover:bg-[#6F5D81] hover:text-white p-2 hover:rounded-full m-6 ${pathName==='/autonomous'?" text-white rounded-full bg-[#6F5D81]":""}`} href="/autonomous">
                <BotIcon className="hover:text-white text-[#B9ABA7]  " />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Autonomus</TooltipContent>
          </Tooltip>
        </TooltipProvider>
       
      </motion.div>
    </div>
  )
}

export default Sidebar