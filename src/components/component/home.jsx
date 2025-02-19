'use client'
import Image from "next/image";
import { Button } from "../ui/button"
import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from "../ui/tooltip"
import { motion } from 'framer-motion';
import { useEffect } from "react";
export function Main() {
  
  return (
    (<div className="h-screen  p-10">

      <div className="grid grid-cols-2 gap-4 ml-4 w-full">
        <motion.div
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="col-span-1 p-4 bg-white/10 backdrop-blur-md rounded-xl"
          initial={{
            opacity: 0,
            x: -100,
          }}
          transition={{
            duration: 1,
          }}>
          <h2 className="mb-2 text-lg font-semibold text-white">Home</h2>
          
          <Image alt="home" height={200} src="/logo.jpg" width={200} className="h-[200px] w-full"/>
        </motion.div>
        <motion.div
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="col-span-1 p-4 bg-white/10 backdrop-blur-md rounded-xl"
          initial={{
            opacity: 0,
            x: -100,
          }}
          transition={{
            duration: 1,
          }}>
          <h2 className="mb-2 text-lg font-semibold text-white">Home</h2>
          <Image alt="home" height={200} src="/logo.jpg" width={200} className="h-[200px] w-full"/>
        </motion.div>
        <motion.div
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="col-span-1 p-4 bg-white/10 backdrop-blur-md rounded-xl"
          initial={{
            opacity: 0,
            x: -100,
          }}
          transition={{
            duration: 1,
          }}>
          <h2 className="mb-2 text-lg font-semibold text-white">Home</h2>
          <Image alt="home" height={200} src="/logo.jpg" width={200} className="h-[200px] w-full"/>
        </motion.div>
        <motion.div
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="col-span-1 p-4 bg-white/10 backdrop-blur-md rounded-xl"
          initial={{
            opacity: 0,
            x: -100,
          }}
          transition={{
            duration: 1,
          }}>
          <h2 className="mb-2 text-lg font-semibold text-white">Home</h2>
          <Image alt="home" height={200} src="/logo.jpg" width={200} className="h-[200px] w-full"/>
        </motion.div>
      </div>
    </div>)
  );
}


function HomeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>)
  );
}


function SettingsIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>)
  );
  
}
