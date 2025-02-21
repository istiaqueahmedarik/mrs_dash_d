'use client'
import { Box, Button, Modal, Typography } from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Cropper } from 'react-cropper'
import Webcam from 'react-webcam'
import 'cropperjs/dist/cropper.css'
import ExperimentChart from './ExperimentChart'
import GridOption from './gridOption'
import { io } from 'socket.io-client'

// Update the URL if needed to match your Flask SocketIO server address
const socket = io('http://192.168.43.17:3002')

function AR({ type }) {
  const webcamRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [image, setImage] = useState(null)
  const [cropData, setCropData] = useState('#')
  const cropperRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [isLive, setIsLive] = useState(true)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'scroll',
  }

  const handleOpen = () => {
    setImage(imgSrc)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const capture = () => {
    const img = imgSrc
    setImgSrc(img)
    setCropData(img)
    setImage(img)
    handleOpen()
  }

  const onChange = (e) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
    }
    reader.readAsDataURL(files[0])
  }

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())
    }
  }

  useEffect(() => {
    socket.on('image', (message) => {
      // For the Flask server, the payload is sent in message.zed
      setImgSrc('data:image/jpeg;base64,' + message.zed)
    })
    return () => {
      socket.off('image')
    }
  }, [])

  return (
    <div className="p-5 m-auto grid place-content-center">
      <div className="m-auto rounded-md p-5 mb-[2rem] bg-[#222222]">
        <div className="flex justify-between items-center mb-4 ml-2">
          <p className="text-white">Live Feed</p>
          <div className={`h-3 w-3 rounded-full transition-all ${isLive ? 'bg-red-500' : 'bg-gray-500'}`}/>
        </div>
        {imgSrc &&
          <Image onClick={handleOpen} src={imgSrc} alt="image" className='rounded-lg w-full h-full' width={200} height={200}/>
        }
        {imgSrc &&
          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" className='overflow-y-scroll'>
            <Box sx={style}>
              <Image src={image} alt="image" className='rounded-lg w-full h-full' width={200} height={200}/>
            </Box>
          </Modal>
        }
      </div>
    </div>
  )
}

export default AR
