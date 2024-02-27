'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from 'react-three-fiber'
import { OrbitControls } from "@react-three/drei";
import { Mesh } from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import RoverCam from './RoverCam'
import AR from './ArCam'

import Mp from './Map';
import { Box, Modal } from '@mui/material';
import { io } from 'socket.io-client';
import { debounce } from 'lodash';
import ArRow from './ArRow';
function MeshComponent({ fileUrl,position }) {
    const { camera } = useThree();
  useEffect(() => {
    camera.position.z = 90; 
  }, [camera]);
  const mesh = useRef<Mesh>(null);
  const gltf = useLoader(GLTFLoader, fileUrl);
  const myRef = useRef(null);
  myRef.current = mesh;
//   useFrame(() => {
//     if (myRef.current) {
//       myRef.current.rotation.y += 0.01;
//     }
//   }); 
  
  const [x, setX] = useState(10);
  const [y, setY] = useState(10);
  const [z, setZ] = useState(10);

  useFrame(() => {
    
    setX(x + Math.random() * 0.2 - 0.1);
    setY(y + Math.random() * 0.2 - 0.1);
    setZ(z + Math.random() * 0.2 - 0.1);

    if (myRef.current) {
      myRef.current.position.set(x, y, z);
    
    }
    
  });

  
  return (
    <mesh ref={myRef}>
      <primitive object={gltf.scene} position={[x,y,z]}  />
      
    </mesh>
  );
}
const socket = io('http://192.168.1.2:3002')

function Autonomus() {
  const [newTable, setNewTable] = useState([]);
  
  const controlsRef = useRef();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  const [coordinates, setCoordinates] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [curMsg, setCurMsg] = useState({
    id: ['1', '2', '3'],
    dist: [150, 250, 100]
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const exists = coordinates.some(coord => coord.lat === latitude && coord.lng === longitude);
          if (!exists) {
            setCoordinates(old => [...old, { lat: latitude, lng: longitude }]);
          }
   
    setLatitude('');
    setLongitude('');
  };
  const [currentLocation, setCurrentLocation] = useState([]);
  console.log(coordinates);

  const calculateDistance = (x1,y1,x2,y2) => {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
  };

  function calculateHeading(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    let res = (angle + 360) % 360;
    let str = '';
    if (res >= 0 && res < 90) {
      str = 'NE';
    } else if (res >= 90 && res < 180) {
      str = 'SE';
    } else if (res >= 180 && res < 270) {
      str = 'SW';
    } else {
      str = 'NW';
    }
    return str;
}

  const handleCheck = (index) => {
    setCoordinates(coordinates.map((coord, i) => i === index ? { ...coord, checked: !coord.checked } : coord));
  };
  
  const handleDelete = (index) => {
    setCoordinates(coordinates.filter((_, i) => i !== index));
  };


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      setCoordinates((old) => old.length === 0 ? [{lat: position.coords.latitude, lng: position.coords.longitude}] : old);
    });
    const debouncedHandleData = debounce((data) => {
      setCurMsg(data);
      console.log(data);
    }, 500); 
  
    socket.on('data', debouncedHandleData);
  
    return () => {
      socket.off('data', debouncedHandleData);
    };
  }, []);

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
  return (
    <div className='flex flex-col justify-between'>
        <div className='topMain grid grid-cols-[1fr_3fr] place-content-center ml-auto w-fit'>
                <div className='m-auto w-full p-5'>
                <div className='roverLiveDetails border border-white m-auto p-12 rounded-3xl w-full' >
                    <h1 className='text-xl'>Lattitude: {currentLocation[0]}</h1>
                    <h1 className='text-xl'>Longitude: {currentLocation[1]}</h1>
                    
                    <h1 className='text-xl'>Speed: XX</h1>
                    <h1 className='text-xl'>Direction: XX</h1>
                    <h1 className='text-xl'>Acceleration: XX</h1>
                </div>
                </div>
                <div className='w-[45rem] h-[30rem] m-auto'>
                  <h1 className='text-center text-2xl mb-2'>Live Orientation 🔴</h1>
                <Canvas className='h-[20rem] w-[20rem] bg-[#b3b3b3] rounded-3xl'>
        <OrbitControls ref={controlsRef} enableRotate={true}  />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />
      <pointLight position={[10, -10, 10]} />
      <pointLight position={[-10, 10, -10]} />
        <MeshComponent fileUrl={'/threed.gltf'}  />
      </Canvas>
                </div>

        </div>
       <div className='mt-20'>
        <h1 className='text-3xl text-center'>Camera Feedback</h1>
       <div className='m-auto w-full flex flex-row justify-between'>
       <RoverCam type={'microscope'}/>
       <RoverCam type={'microscope'}/>
       <RoverCam type={'microscope'}/>
        </div>
       </div>
       <div className='mb-6 '>
        <h1 className='text-3xl text-center'>GNSS Marker</h1>
        <div className='flex flex-row justify-around mt-5 mb-5'>
          <div className=''>
            <button className='bg-[#222222] p-3 text-center rounded-3xl text-white m-auto w-full hover:bg-[#2d2d2d] transition-all' onClick={handleOpen}>Set Navigation Stack</button>
            <div className='h-[20vh]'>
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Latitude</th>
                <th className="px-4 py-2">Longitude</th>
                <th className="px-4 py-2">Distance</th>
                <th className="px-4 py-2">Heading</th>
                <th className="px-4 py-2">Checked</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {coordinates.map((coord, index) => (
                index===0?null:<tr key={index}>
                <td className="px-4 py-2">{coord.lat}</td>
                <td className="px-4 py-2">{coord.lng}</td>
                <td className="px-4 py-2">{calculateDistance(currentLocation[0], currentLocation[1], coord.lat, coord.lng)}</td>
                <td className="px-4 py-2">{calculateHeading(currentLocation[0], currentLocation[1], coord.lat, coord.lng)}</td>
                <td className="px-4 py-2">
                  <input type="checkbox"  checked={calculateDistance(currentLocation[0], currentLocation[1], coord.lat, coord.lng) === 0 ? true : coord.checked}  onChange={() => handleCheck(index)} />
                </td>
                <td className="px-4 py-2">
                  <button className='bg-red-700 rounded-full p-1 pl-2 pr-2' onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>

            <Modal open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='overflow-y-scroll'>
        <Box  sx={style}>
          <h1>Setup</h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center mt-5">
            <input
              className="text-black border border-gray-300 rounded-md py-2 px-4 mb-2 w-64"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude"
              required
            />
            <input
              className="text-black border border-gray-300 rounded-md py-2 px-4 mb-2 w-64"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Marker
            </button>
          </form>
        </Box>
      </Modal>
          </div>
          <div className='h-[20vh] relative'>
          {currentLocation.length===0?null:<Mp coordinates={coordinates}/>}
        </div>
        </div>
       </div>

       <div className='mt-[12rem] bg-[#111010] m-5'>
        <h1 className='text-center text-white text-3xl'>AR Tags Analyze</h1>
       <div className=' grid grid-cols-2  w-full ml-auto mr-auto  p-5 rounded-xl h-[30rem]'>

<div className="w-[40rem] h-[40rem]">
<AR type={"microscope"}/>
</div>
<div className='w-full text-left ml-auto mr-auto'>
<table className="w-full">
  <thead>
    <tr>
      <th className="px-4 py-2 text-left">ID</th>
      <th className="px-4 py-2 text-left">Distance</th>
    </tr>
  </thead>
  <tbody>
  {currentLocation.length>0?curMsg.id?.map((id, index) => {
    


    return (
      <ArRow newTable={newTable} setNewTable={setNewTable} key={index} id={id} dist={curMsg.dist[index]} lat={currentLocation[0]} lng={currentLocation[1]}/>
    );
  }):null}
</tbody>
</table>
</div>

</div>

<div className='bg-[#272727] rounded-xl p-[5rem]'>
  {newTable.length > 0 ? (
    <div className="w-full">
      <h1 className="text-center text-white text-3xl mb-5">Success</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Distance</th>
            <th className="px-4 py-2 text-left">Latitude</th>
            <th className="px-4 py-2 text-left">Longitude</th>
            <th className="px-4 py-2 text-left">Time</th>
          </tr>
        </thead>
        <tbody>
          {newTable.map((row, index) => {
            console.log(row)
            return (
              <tr key={index}>
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.dist}</td>
                <td className="px-4 py-2">{row.lat}</td>
                <td className="px-4 py-2">{row.lng}</td>
                <td className="px-4 py-2">{row.time}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  ):null}
</div>

       </div>

       
    </div>
  )
}

export default Autonomus