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
const socket = io('http://10.104.128.100:3002')

function Life() {
  const webcamRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [facingMode, setFacingMode] = useState(0)
  const [selectedOption, setSelectedOption] = useState('0');
  const [Protein, setProtein] = useState([]);
  const [Benedict, setBenedict] = useState([]);
  const [Iodin, setIodin] = useState([]);
  

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
  console.log(selectedOption);
  if(selectedOption==='Protein'){
    setProtein([...Protein, cropData]);
  }
  if(selectedOption==='Benedict'){
    setBenedict([...Benedict, cropData]);
  }
  if(selectedOption==='Iodin'){
    setIodin([...Iodin, cropData]);
  }
};

  const [image, setImage] = useState(
    'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg',
  )
  const [cropData, setCropData] = useState('#')
  const cropperRef = useRef(null)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%' ,
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
  const [cur,setCur] = useState('rock');
  const switchCamera = () => {
    setCur(cur==='rock'?'microscope':'rock')
    console.log(cur)

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

  const [grid, setGrid] = useState(Array(3).fill(Array(4).fill(false)));

  const setData = (rowIndex,colIndex) =>{
    const newGrid = grid.map((row, r) => row.map((col, c) => {
      if (r === rowIndex && c === colIndex) {
        return true;
      }
      return col;
    }));
    setGrid(newGrid);

  }
  const resetData = (rowIndex,colIndex) =>{
    const newGrid = grid.map((row, r) => row.map((col, c) => {
      if (r === rowIndex && c === colIndex) {
        return false;
      }
      return col;
    }));
    setGrid(newGrid);
  }
  const [isLive, setIsLive] = useState(true);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIsLive(prevIsLive => !prevIsLive);
  //   }, 500); 
  
  //   return () => clearInterval(interval);
  // }, []);

  React.useEffect(()=>{
    socket.on('image', (message) => {
      if(message['camera']===cur){
          setImgSrc('data:image/jpeg;base64,'+message['image'])}
    })
      
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
      {imgSrc!==null?<Image src={imgSrc} alt={"image"}  className='rounded-lg w-[16rem] h-[16rem]' width={400} height={400}/>:null}
        <div className="flex flex-row justify-around mt-5 mb-5">
          <button
            className="bg-blue-400 pt-3 pb-3 pl-5 pr-5 rounded-full hover:bg-white hover:text-black transition-all"
            onClick={capture}
          >
            Save
          </button>
          <button
            className="bg-blue-400 pt-3 pb-3 pl-5 pr-5 rounded-full hover:bg-white hover:text-black transition-all"
            onClick={()=>switchCamera()}
          >
            Switch Camera
          </button>
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
            <div className="w-64 m-auto mt-2">
  <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-state">
    Choose An Experiment Type
  </label>
  <div className="relative">
    <select 
      className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
      id="grid-state"
      value={selectedOption}
      onChange={handleSelectChange}
    >
      <option>Choose An Experiment</option>
      <option>Protein</option>
      <option>Benedict</option>
      <option>Iodin</option>
    </select>
  </div>
  <button className="mt-4 w-full bg-blue-400 pt-2 pb-2 pl-3 pr-3 rounded-full hover:bg-white hover:text-black transition-all " hidden={selectedOption==='0'} onClick={handleButtonClick}>Save it!</button>
</div>

          </Typography>
        </Box>
      </Modal>

      <div className='grid grid-cols-[1fr_1fr] gap-6'>
      
                  <GridOption grid={grid} setGrid={setGrid}/>
                  <div>
                    <ExperimentChart resetData={resetData} setData={setData} grid={grid} setGrid={setGrid} protein={Protein} benedict={Benedict} iodin={Iodin}/>
                  </div>

      </div>
    </div>
  )
}

export default Life
