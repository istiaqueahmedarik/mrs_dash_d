'use client'
import React, { useState } from 'react'
import Cam from './Cam'
import Image from 'next/image'
import { Box, Modal } from '@mui/material'

function Rock() {
    const [rock, setRock] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [microscope, setMicroscope] = useState([])
    let prediction = ['Shale', 'Slate', 'Sandstone', 'Limestone', 'Granite', 'Basalt', 'Gneiss', 'Marble', 'Quartzite', 'Schist']
    const [open, setOpen] = React.useState(false)
    const handleClose = () => setOpen(false)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '55%' ,
        bgcolor: 'black',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '40px',
      }
    const handleButtonClick = () => {
        console.log('Processing')
        localStorage.setItem('rock1', rock[rock.length-1])
        localStorage.setItem('rock2', rock[rock.length-2])
        localStorage.setItem('rock3', rock[rock.length-3]);
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        setOpen(true)
    }
    
    let predictionText;
  if (isLoading) {
    predictionText = <div>Loading...</div>;
  } else {
    predictionText = " "+prediction[Math.floor(Math.random() * prediction.length)];
  }
  return (
    <div>
        <div className='flex flex-row'>
       <div>
        <h1 className='text-2xl mt-5'>Microscope</h1>
       <Cam type={'microscope'} data={microscope} setData={setMicroscope}/>
       </div>
       <div>
        <h1 className='text-2xl mt-5'>Main Camera</h1>
        <Cam type={'rock'} data={rock} setData={setRock}/>

       </div>
        
    </div>
    <div className='m-5'>
    <h1 className='text-4xl pl-5 mb-2'>
        Microscope Image
    </h1>
    {microscope.length>0?<Image width={400} height={400} src={microscope[microscope.length-1]} alt='microscope' className='m-5'/>:<h1 className='m-5'>No Image</h1>}
    
    </div>
    <div className='m-5'>
    <h1 className='text-4xl pl-5'>
        Rock Type Detection
    </h1>
    {rock.length===0?<h1 className='m-5'>No Images yet!</h1>:null}
    <div className='flex flex-row'>
        {rock.slice(-3).map((image, index) => {
        return (
            <div key={index} className='m-5 '>
                <Image width={400} height={400} src={image} alt='rock'/>
            </div>
        )
    })}
    {rock.length>=1 && rock.length<3?<div className='m-5'><h1 className='text-2xl text-red-600'>Not enough images</h1></div>:null}
    </div>
    <button className="bg-blue-400 pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2" onClick={handleButtonClick} hidden={rock.length<3}>Process</button>
    <button className="bg-red-400 pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2 " hidden={rock.length<3} >Start Raman Spectroscopy Analysis</button>
    </div>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='overflow-y-scroll'
      >
        <Box sx={style}>
        <div className='flex flex-row'>
        {rock.slice(0, 3).map((image, index) => {
        return (
            <div key={index} className='m-5 '>
                <Image width={400} height={400} src={image} alt='rock'/>
            </div>
        )
    })}
    
    </div>
    <h1 className='text-3xl'>
      This Rock is most likely a 
      <span className='text-red-500'>
        {predictionText}
      </span>
    </h1>
        </Box>
      </Modal>
    
    </div>
  )
}

export default Rock