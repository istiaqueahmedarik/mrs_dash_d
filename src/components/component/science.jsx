'use client'
import {  FilePieChartIcon, HeartHandshakeIcon, MicroscopeIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from 'react-three-fiber'
import { OrbitControls } from "@react-three/drei";
import { Mesh } from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import MeshComponent from './MeshComponent'
function Science() {
  const controlsRef = useRef();
  return (
    <div className='flex flex-col scrollbar'>
      <h1 className='text-4xl font-extrabold text-center'>Science Dashboard</h1>
      <div className='w-full h-[35vh] mb-4'>
      {/* <Canvas 
  className='h-20 w-20 bg-[#0D0D0D]'
  camera={{ position: [0, 0, 5], fov: 60 }}
>
  <OrbitControls ref={controlsRef} enableRotate={true} />
  <ambientLight />
  <pointLight position={[10, 10, 10]} />
  <pointLight position={[-10, -10, -10]} />
  <pointLight position={[10, -10, 10]} />
  <pointLight position={[-10, 10, -10]} />
  <MeshComponent fileUrl={'/threed.gltf'} />
</Canvas> */}
      </div>
      
<div className='grid grid-cols-3 gap-3 place-content-center w-full justify-around'>
       
      <Link href='/science/basic' className='border bg-white/10 backdrop-blur-md border-white w-fit p-[4rem] rounded-xl grid place-content-center m-auto hover:bg-white transition-all hover:text-black'>
        <h1 className='text-[2rem] mb-3 text-center'>Sensor Data</h1>
        <FilePieChartIcon className='m-auto w-[6em] h-[6em]'/>
      </Link>
      {/* <Link href='/science/life' className='border bg-white/10 backdrop-blur-md border-white w-fit p-[4rem] rounded-xl grid place-content-center m-auto hover:bg-white transition-all hover:text-black'>
        <h1 className='text-[2rem] mb-3 text-center'>Life Detection</h1>
        <HeartHandshakeIcon className='m-auto w-[6em] h-[6em]'/>
      </Link>
      <Link href='/science/rock' className='border bg-white/10 backdrop-blur-md border-white w-fit p-[4rem] rounded-xl grid place-content-center m-auto hover:bg-white transition-all hover:text-black'>
        <h1 className='text-[2rem] mb-3 text-center'>Rock Detection</h1>
        <MicroscopeIcon className='m-auto w-[6em] h-[6em]'/>
      </Link> */}
      {/* <Link href='/' className='border bg-white/10 backdrop-blur-md border-white w-fit p-[4rem] rounded-xl grid place-content-center m-auto hover:bg-white transition-all hover:text-black'>
        <h1 className='text-2xl mb-3'>Basic</h1>
        <FilePieChartIcon className='m-auto w-[3em] h-[3em]'/>
      </Link>  */}
      

    </div>
    </div>
    
  )
}

export default Science

const RockIcon = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      className="bi bi-gem"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8 0l6 16H2l6-16zm0 0v16V0z"
      />
    </svg>
  )
}