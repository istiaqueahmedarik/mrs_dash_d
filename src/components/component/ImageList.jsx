import Image from 'next/image'
import React, { useEffect } from 'react'

function ImageList({protein,benedict,iodin, b,setB,setData,resetData,sample,setGrid,grid,Nh3,fn,setfN,it,setiT,val,setVal,pb,set,data1,data2,data3}) {
  const getColor = (val) => {
    if (val <= 0.5) return 'blue-500';
    if (val <= 1) return 'grern-500';
    if (val <= 1.5) return 'yellow-500';
    if (val <= 2) return 'orange-500';
    return 'red-900';
  };
  const getResult = (val) =>{
    if(val===-1)return 'No Data Yet'
    if(val<=0.5)return 'No Reducing Sugar'
    if(val<=1) return 'Traceable Reducing Sugar'
    if(val<=1.5) return 'Low Reducing Sugar'
    if(val<=2) return 'Moderate Reducing Sugar'
    return 'High Reducing Sugar'
  }

  
  
  const togglingProtein = (val) => {
    set(val);
    if(val===1) {
      resetData(sample-1,2)
    }
    else if(val===2) {
      setData(sample-1,2)
    }
    
  }

  const togglingiT = (val)=> {
    setiT(val)
    if(val===1) {
      resetData(sample-1,1)
    }
    else if(val===2 || val===3) {
      setData(sample-1,1)
    }

  }

  const togglingBenedict = (val) => {
    setB(val);
    if(val===1) {
      resetData(sample-1,0)
    }
    else if(val===2) {
      resetData(sample-1,0)
    }
    else if(val===3) {
      setData(sample-1,0)
    }
    else if(val===4) {
      setData(sample-1,0)
    }
    else if(val===5) {
      setData(sample-1,0)
    }

  }

  const toggleFn = (val) => {
    setfN(val)
    if(val<60) resetData(sample-1,3)
    else setData(sample-1,3)
  }
  

  return (
    <div className='grid  w-full grid-rows-4 gap-3 m-2'>
      <div className='grid grid-rows-2 w-full place-content-center m-auto bg-slate-900 p-5 pt-[5rem] pb-[5rem] rounded-xl'>


          {/* {fn===-1?<h1 className='text-center text-4xl'> Ammonia Level: {Nh3}</h1>:null} */}
          {fn===-1?<h1 className='text-center text-4xl'> Ammonia Level: 5</h1>:null}



          {fn===-1?<button className={`bg-green-600 pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2 text-2xl`} onClick={(e)=>toggleFn(Nh3)}>Set This Data For This Sample</button>:<h1>Ammonia: {fn}</h1>}
        </div>
        <div className='grid grid-cols-2 gap-2 w-full bg-[#222222] p-1 mb-2 rounded-xl'>
        {protein.length<=sample-1?<div className=' text-white text-center m-5'>No Data on Protein Yet</div>:<Image src={protein[sample-1]} alt={"image"}  className='rounded-lg w-full m-auto' width={400} height={400}/>}
        {protein.length<=sample-1?<div className=' text-white text-center m-5'>No Data on Protein Yet</div>:
        <div className=''>
          <h1 className='text-4xl mb-2 text-slate-400'>Protein Test: </h1>
          <h1>Select The Color:</h1>
          <div className='grid'>
          <button className={`${pb===1?"bg-green-600":"bg-blue-400"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingProtein(1)}>Blue</button>
          <button className={`${pb===2?"bg-green-600":"bg-purple-800"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black  transition-all m-2`} onClick={()=>togglingProtein(2)}>Deep Purple</button>
          
        </div>
        {pb!==0?pb===1?<h1 className='text-white'>Result: Absent</h1>:<h1 className='text-white'>Result: Present</h1>:null}
        </div>
        }
        </div>

        <div className='grid grid-cols-2 gap-2 w-full bg-[#222222] p-1 mb-2 rounded-xl'>
        {benedict.length<=sample-1?<div className=' text-white text-center m-5'>No Sample For Benedict Test Yet</div>:<Image src={benedict[sample-1]} alt={"image"}  className='rounded-lg w-full m-auto' width={400} height={400}/>}
        {benedict.length<=sample-1?<div className=' text-white text-center m-5'>No Data on Benedict Test data Yet</div>:
         <div className=''>
         <h1 className='text-4xl mb-2 text-slate-400'>Benedict Test: </h1>

         <h1>Select The Color:</h1>
         <div className='grid'>
         <button className={`${b===1?"bg-green-600":"bg-blue-500"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingBenedict(1)}>Blue</button>
         <button className={`${b===2?"bg-green-600":"bg-green-500"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingBenedict(2)}>Green</button>
         <button className={`${b===3?"bg-green-600":"bg-yellow-500"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingBenedict(3)}>Yellow</button>
         <button className={`${b===4?"bg-green-600":"bg-orange-500"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingBenedict(4)}>Orange</button>
         <button className={`${b===5?"bg-green-600":"bg-red-700"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingBenedict(5)}>Brick-Red</button>
         
       </div>
       {b===1?<h1 className='text-white'>Result: No Reducing Sugar</h1>:null}
       {b===2?<h1 className='text-white'>Result: Traceable</h1>:null}
       {b===3?<h1 className='text-white'>Result: Low</h1>:null}
       {b===4?<h1 className='text-white'>Result: Moderate</h1>:null}
       {b===5?<h1 className='text-white'>Result: High</h1>:null}
       </div>  

        }
        </div>

        <div className='grid grid-cols-2 gap-2 w-full bg-[#222222] p-1 mb-2 rounded-xl'>
        {iodin.length<=sample-1?<div className=' text-white text-center m-5'>No Data on Iodin Test Yet</div>:<Image src={iodin[sample-1]} alt={"image"}  className='rounded-lg w-full m-auto' width={400} height={400}/>}
        {iodin.length<=sample-1?<div className=' text-white text-center m-5'>No Data on Iodin Test Yet</div>
        :
        <div className=''>
          <h1 className='text-4xl mb-2 text-slate-400'>Iodin Test: </h1>

          <h1>Select The Color:</h1>
          <div className='grid'>
          <button className={`${it===1?"bg-green-600":"bg-[#EBAA1A]"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingiT(1)}>dH<sup>2</sup>O</button>
          <button className={`${it===2?"bg-green-600":"bg-[#AB391E]"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingiT(2)}>Glycogen</button>
          <button className={`${it===3?"bg-green-600":"bg-[#35393C]"} pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2`} onClick={()=>togglingiT(3)}>Starch</button>
          
        </div>
        {it!==0?it===1?<h1 className='text-white'>Result: Absent</h1>:<h1 className='text-white'>Result: Present</h1>:null}
        </div>  
      }
        </div>

        
    </div>
  )
}

export default ImageList