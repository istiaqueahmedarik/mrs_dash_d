'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from 'react-three-fiber'
import { OrbitControls } from "@react-three/drei";
import { Mesh } from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import RoverCam from './RoverCam'
import AR from './ArCam'
import Rviz from './Rviz' 
import axios from 'axios';
import Mp from './Map';
import { Box, Modal } from '@mui/material';
import { io } from 'socket.io-client';
import { debounce, set } from 'lodash';
import ArRow from './ArRow';
import RoverCam1 from './RoverCam1';
import RoverCam2 from './RoverCam2';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Timer from './Timer'
function MeshComponent({ fileUrl,position }) {
    const { camera } = useThree();
  useEffect(() => {
    camera.position.z = 90; 
  }, [camera]);
  const mesh = useRef<Mesh>(null);
  const gltf = useLoader(GLTFLoader, fileUrl);
  const myRef = useRef(null);
  myRef.current = mesh;
  
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
const socket = io('http://127.0.0.1:3002')
const socket1 = io('http://192.168.43.17:3002');
const rosSocket = io('http://localhost:8000');
function Autonomus() {
  const [newTable, setNewTable] = useState([]);
  const [motion, setMotion] = useState({ speed: 0, direction: 0, acceleration: 0 });
  
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
    
  });
  const handleSubmit = async(e) => {
    e.preventDefault();
    const exists = coordinates.some(coord => coord.lat === latitude && coord.lng === longitude);
          if (!exists) {
            setCoordinates(old => [...old, { lat: latitude, lng: longitude }]);
          }

    const options = {
      url: 'http://localhost:8000/waypoints',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: {
        latitude: latitude,
        longitude: longitude,
        altitude: 0
      }
    };
    
    axios(options)
      .then(response => {
        console.log(response.status);
      });
   
    setLatitude('');
    setLongitude('');
    handleClose();
  };
  const [currentLocation, setCurrentLocation] = useState([]);
  console.log(coordinates);

  const calculateDistance = (lat1,lng1,lat2,lng2) => {
    const R = 6371e3; 
    const φ1 = lat1 * Math.PI/180; 
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    const d = R * c;
    return d;
  };

  function angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  }

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
    rosSocket.on('global_position',(message)=>{
      console.log(message.data.latitude);
    })
    rosSocket.on('waypoint_message',(message)=>{
      console.log("waypoints:",message);
    })
    
    

    let watchId = null;

    function generateRandomValues() {
      const speed = (Math.random() * 100).toFixed(2);
      const direction = (Math.random() * 360).toFixed(2);
      const acceleration = (Math.random() * 10).toFixed(2);

      return { speed, direction, acceleration };
    }

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((pos) => {
        setCurrentLocation([pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6)]);
        setCoordinates((old) => old.length === 0 ? [{lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6)}] : old);
        setCoordinates((old) => {old[0] = {lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6)}; return old;});
        
        setMotion(generateRandomValues());
      }, (error) => {
        console.error("Error occurred: " + error.message);
      }, {
        enableHighAccuracy: true,
        timeout: 100,
        maximumAge: 0
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    

    const debouncedHandleData = debounce((data) => {
      setCurMsg(data);
      console.log(data);
    }, 500); 
  
    socket1.on('data', (message)=>{
        let id = message.id;
        let dist = message.dist;
        let n = id.length;
        for (let i = 0; i < n-1; i++) {
          for (let j = 0; j < n-i-1; j++) {
            if (id[j] > id[j+1]) {
              let temp = id[j];
              id[j] = id[j+1];
              id[j+1] = temp;
              temp = dist[j];
              dist[j] = dist[j+1];
              dist[j+1] = temp;
            }
          }
        }
        setCurMsg({id, dist});
      
    });
  
    return () => {
      socket1.off('data');
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
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
    <div className='text-white'>
      <Timer/>
      <Tabs defaultValue="rover">
        <TabsList className='m-auto w-full bg-transparent py-5'>
          <TabsTrigger value="rover">Rover</TabsTrigger>
          <TabsTrigger value="gnss">GNSS Marker</TabsTrigger>
          <TabsTrigger value="ar">AR Analysis</TabsTrigger>
          <TabsTrigger value="object">Object Analysis</TabsTrigger>
          <TabsTrigger value="camera">Camera Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="rover" className='text-white'>
          <div className='flex flex-col justify-between'>
            <div className='topMain grid grid-cols-3 place-content-center ml-auto w-full'>
              <div className='m-auto bg-[#151d2e] p-4 rounded-xl'>
                <h1 className='text-2xl text-center'>Rover</h1>
                <div className='roverLiveDetails m-auto p-14 rounded-3xl w-full bg-gray-900 text-white mt-5'>
                  <h1 className='text-xl'>Latitude: {(currentLocation[0])}</h1>
                  <h1 className='text-xl'>Longitude: {currentLocation[1]}</h1>
                  <h1 className='text-xl'>Speed: {motion.speed} ms<sup>-1</sup></h1>
                  <h1 className='text-xl'>Direction: {motion.direction} {calculateHeading(motion.direction)}</h1>
                  <h1 className='text-xl'>Acceleration: {motion.acceleration} ms<sup>-2</sup></h1>
                </div>
              </div>
              <div className="">
                <RoverCam type="microscope" />
              </div>
              <div className='m-auto max-w-xl h-[35vh]'>
                <h1 className='text-center text-2xl'>Live Orientation 🔴</h1>
                <Canvas className='h-auto max-w-lg aspect-auto bg-[#b3b3b3] rounded-3xl'>
                  <OrbitControls ref={controlsRef} enableRotate={true} />
                  <ambientLight />
                  <pointLight position={[10, 10, 10]} />
                  <pointLight position={[-10, -10, -10]} />
                  <pointLight position={[10, -10, 10]} />
                  <pointLight position={[-10, 10, -10]} />
                  <MeshComponent fileUrl={'/threed.gltf'} />
                </Canvas>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gnss" className='text-white'>
          <div className='mb-6'>
            <h1 className='text-3xl text-center'>GNSS Marker</h1>
            <div className='flex flex-row justify-around mt-5 mb-5'>
              <div>
                <button className='bg-[#222222] p-3 text-center rounded-3xl text-white m-auto w-full hover:bg-[#2d2d2d] transition-all' onClick={handleOpen}>
                  Set GNSS Navigation Way Point
                </button>
                <div className='h-[20vh]'>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Index</th>
                        <th className="px-4 py-2">Latitude</th>
                        <th className="px-4 py-2">Longitude</th>
                        <th className="px-4 py-2">Distance(m)</th>
                        <th className="px-4 py-2">Heading</th>
                        <th className="px-4 py-2">Checked</th>
                        <th className="px-4 py-2">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coordinates.map((coord, index) => (
                        index === 0 ? null : <tr key={index}>
                          <td className="px-4 py-2">{index}</td>
                          <td className="px-4 py-2">{coord.lat}</td>
                          <td className="px-4 py-2">{coord.lng}</td>
                          <td className="px-4 py-2">{calculateDistance(currentLocation[0], currentLocation[1], coord.lat, coord.lng).toFixed(2)}</td>
                          <td className="px-4 py-2">{angle(currentLocation[0], currentLocation[1], coord.lat, coord.lng).toFixed(2)} {calculateHeading(currentLocation[0], currentLocation[1], coord.lat, coord.lng)}</td>
                          <td className="px-4 py-2">
                            <input type="checkbox" checked={calculateDistance(currentLocation[0], currentLocation[1], coord.lat, coord.lng) === 0 ? true : coord.checked} onChange={() => handleCheck(index)} />
                          </td>
                          <td className="px-4 py-2">
                            <button className='bg-red-700 rounded-full p-1 pl-2 pr-2' onClick={() => handleDelete(index)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className='bg-[#868ff6] p-3 text-center rounded-3xl text-white m-auto w-full hover:bg-[#2d2d2d] transition-all' onClick={handleOpen}>
                  Start Navigation
                </button>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" className='overflow-y-scroll'>
                  <Box sx={style}>
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
                        Set GNSS Navigation Way Point
                      </button>
                    </form>
                  </Box>
                </Modal>
              </div>
              <div className='h-[60vh] w-[40rem] relative'>
                {currentLocation.length === 0 ? null : <Mp coordinates={coordinates} />}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ar" className='text-white'>
          <div className=' m-5'>
            <h1 className='text-center text-white text-3xl'>Realtime AR Tags Analyze</h1>
            <div className='grid grid-cols-1 w-full ml-auto mr-auto p-5 rounded-xl h-[30rem]'>
              
              <div className='w-full text-left ml-auto mr-auto'>
                <table className="w-full text-center">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Distance(cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLocation.length > 0 && curMsg.id?.map((id, index) => {
                      return (
                        <ArRow newTable={newTable} setNewTable={setNewTable} key={index} id={id} dist={curMsg.dist[index]} lat={currentLocation[0]} lng={currentLocation[1]} />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='bg-gray-800 rounded-xl p-10'>
              {newTable.length > 0 ? (
                <div className="w-full">
                  <h1 className="text-center text-white text-3xl mb-5">Successful AR Tags Traverse</h1>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-white">ID</th>
                        <th className="px-4 py-2 text-left text-white">Distance(cm)</th>
                        <th className="px-4 py-2 text-left text-white">Latitude</th>
                        <th className="px-4 py-2 text-left text-white">Longitude</th>
                        <th className="px-4 py-2 text-left text-white">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newTable.map((row, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-white">{row.id}</td>
                          <td className="px-4 py-2 text-white">{row.dist}</td>
                          <td className="px-4 py-2 text-white">{row.lat}</td>
                          <td className="px-4 py-2 text-white">{row.lng}</td>
                          <td className="px-4 py-2 text-white">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="object" className='text-white'>
          <div className='  m-5'>
            <h1 className='text-center text-white text-3xl'>Realtime Object Analysis</h1>
            <div className='grid grid-cols-1 w-full ml-auto mr-auto p-5 rounded-xl h-[30rem]'>
              
              <div className='w-full text-left ml-auto mr-auto'>
                <table className="w-full m-auto text-center">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Object Name</th>
                      <th className="px-4 py-2">Distance(cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLocation.length > 0 && curMsg.id?.map((id, index) => {
                      return (
                        <ArRow newTable={newTable} setNewTable={setNewTable} key={index} id={id} dist={curMsg.dist[index]} lat={currentLocation[0]} lng={currentLocation[1]} />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='bg-gray-800 rounded-xl p-10'>
              {newTable.length > 0 ? (
                <div className="w-full">
                  <h1 className="text-center text-white text-3xl mb-5">Successful Object Analysis Traverse</h1>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-white">Object Name</th>
                        <th className="px-4 py-2 text-left text-white">Distance(cm)</th>
                        <th className="px-4 py-2 text-left text-white">Latitude</th>
                        <th className="px-4 py-2 text-left text-white">Longitude</th>
                        <th className="px-4 py-2 text-left text-white">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newTable.map((row, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-white">{row.id}</td>
                          <td className="px-4 py-2 text-white">{row.dist}</td>
                          <td className="px-4 py-2 text-white">{row.lat}</td>
                          <td className="px-4 py-2 text-white">{row.lng}</td>
                          <td className="px-4 py-2 text-white">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="camera" className='text-white'>
          <div className="mt-20">
            <h1 className="text-3xl text-center">Camera Feedback</h1>
            <div className="grid grid-cols-2 place-content-center w-full m-auto justify-center mt-8">
              <div className="w-1/2 m-auto">
                <RoverCam1 type="rock1" />
              </div>
              
              <div className="w-1/2 m-auto">
                <RoverCam2 type="rock2" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Autonomus