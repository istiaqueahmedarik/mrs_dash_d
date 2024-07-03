'use client'
import { Box, Button, Modal, Typography } from '@mui/material'
import Image from 'next/image'
import React, { createRef, useEffect, useRef, useState } from 'react'
import { Cropper } from 'react-cropper'
import Webcam from 'react-webcam'
import 'cropperjs/dist/cropper.css'
import ExperimentChart from './ExperimentChart'
import GridOption from './gridOption'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3002')
function Cam({type,data,setData}) {
  const webcamRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [facingMode, setFacingMode] = useState(0)
  const [selectedOption, setSelectedOption] = useState('0');
  

  const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState([]);

  const handleDevices = React.useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  

const handleSelectChange = (event) => {
  setSelectedOption(event.target.value);
};

const handleButtonClick = () => {
  console.log(cropData);
    setData([...data, cropData]);
  handleClose();
  
};

  const [image, setImage] = useState(
    null
  )
  const [cropData, setCropData] = useState('#')
  const cropperRef = useRef(null)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%' ,
    bgcolor: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'scroll',
  }
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const capture = () => {
    const img = imgSrc
    setImgSrc(img)
    setCropData(img)
    setImage(img)
    handleOpen()
  }

  const switchCamera = () => {
    setFacingMode((prevState) =>
      prevState === devices.length-1 ? 0 : prevState+1
    )
    console.log(devices[facingMode]?.deviceId)
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

  const [isLive, setIsLive] = useState(true);



React.useEffect(()=>{
    socket.on('image', (message) => {
      // console.log(message)
      if(message['camera']===type)
      setImgSrc('data:image/jpeg;base64,'+message['image'])
    })
    return () => {
      socket.off('image')
    }
      
  },[])

  return (
    <div className="p-5 m-auto grid place-content-center">
    <div className="m-auto rounded-md p-5 mb-[2rem] bg-[#222222]">
      <div className="flex justify-between items-center mb-4 ml-2">
        <p className="text-white ">Live Feed</p>
        <div
          className={`h-3 w-3 rounded-full transition-all ${isLive ? 'bg-red-500' : 'bg-gray-500'}`}
        />
      </div>
      {imgSrc!==null?<Image src={imgSrc} alt={"image"}  className='rounded-lg w-full h-full' width={200} height={200}/>:null}
        <div className="flex flex-row justify-around mt-5 mb-5">
          
        
  
       
      
          <button
            className="inline-flex h-12 animate-shimmer items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={capture}
          >
            Save
          </button>
          {/* <button
            className="bg-blue-400 pt-3 pb-3 pl-5 pr-5 rounded-full hover:bg-white hover:text-black transition-all"
            onClick={switchCamera}
          >
            Switch Camera
          </button> */}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='overflow-y-scroll'
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crop the image
          </Typography>
          <Typography id="modal-modal-description" sx={{mt: 2,overflow:'scroll',height:'85vh' }}>
            {/* {imgSrc && <Image alt="pic" height={300} width={300} src={imgSrc} />} */}

            <div style={{ width: '100%' }}>
              <Cropper
                ref={cropperRef}
                style={{ height: 400, width: '100%' }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
              />
            </div>
            <button className="bg-blue-400 pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2 ml-8 w-[80%]" onClick={handleButtonClick}>Save This Image</button>
            <div className='grid grid-cols-2 place-content-center m-auto'>
              <div className="box" style={{ width: '50%', float: 'right' }}>
                <h1>Preview</h1>
                <div
                  className="img-preview"
                  style={{ width: '100%', float: 'left', height: '300px' }}
                />
              </div>
              <div
                className="box"
                style={{ width: '60%', float: 'right', height: '300px' }}
              >
                <div className='flex flex-row justify-between'>
                  <div className="pt-2 pb-2 pl-3 pr-3 m-2">Crop</div>
                  <button
                    className="bg-blue-400 pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all m-2"
                    style={{ float: 'right' }}
                    onClick={getCropData}
                  >
                    Crop Image
                  </button>
                </div>
                {cropData !== '#' ? (
                  <Image
                    width={400}
                    height={400}
                    style={{ width: '100%' }}
                    src={cropData}
                    alt="cropped"
                  />
                ) : (
                  'No Image Selected'
                )}
              </div>
            </div>
            

          </Typography>
        </Box>
      </Modal>

      
    </div>
  )
}

export default Cam
