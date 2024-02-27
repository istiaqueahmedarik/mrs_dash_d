'use client'
import React, { useState } from 'react'
import Cam from './Cam'
import Image from 'next/image'
import { Box, Modal } from '@mui/material'
import Markdown from 'react-markdown'

const fetch = require('node-fetch');

async function getResponse(base64Image) {
  base64Image = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateContent?key=AIzaSyC06-xgOp2mN9G9A_XLVQ7zkS8Cj1-cI7s', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "contents": [
        {
          "parts": [
            {
              "text": "Response in Mardown with first headline in bold form what type of rock are you seeing in the image (must add the types) are you seeing if there is no rock then try again if there is not then response no rock and stop and if there is explain your reason why you think the type in the image based on color texture in only two or three line line in medium italic font in next line\n"
            },
            {
              "inlineData": {
                "mimeType": "image/jpeg",
                "data": base64Image
              }
            }
          ]
        }
      ],
      "generationConfig": {
        "temperature": 0.4,
        "topK": 32,
        "topP": 1,
        "maxOutputTokens": 4096,
        "stopSequences": []
      },
      "safetySettings": [
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    })
  });

  const data = await response.json();
  console.log(data)
  return data;
}


function Rock() {
    const [rock, setRock] = useState([])
    const [pred, setPred] = useState('')
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
        setIsLoading(true)
        getResponse(rock[rock.length-1]).then(data => {
            console.log(data)
            setPred(data.candidates[0].content.parts[0].text)
            setIsLoading(false)
        })
        localStorage.setItem('rock1', rock[rock.length-1])
        localStorage.setItem('rock2', rock[rock.length-2])
        localStorage.setItem('rock3', rock[rock.length-3]);
        
        setOpen(true)
    }
    
    let predictionText;
  if (isLoading) {
    predictionText = <div>Loading...</div>;
  } else {
    predictionText = " "+pred;
  }
  return (
    <div>
        <div className='flex flex-row justify-center'>
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
    {isLoading?<CircularProgress/>:
    
    <Markdown>{pred}</Markdown>
    }

    
        </Box>
      </Modal>
    
    </div>
  )
}

export default Rock

const CircularProgress = () => {
    return (
      <div className='flex flex-row justify-center items-center relative'>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-900"></div>
      <p className="absolute text-center text-white">Predicting...</p>
  </div>
    )
}