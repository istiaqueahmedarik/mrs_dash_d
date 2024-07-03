"use client"
import React, { useEffect, useLayoutEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import { GoogleMap, Marker, MarkerF, useLoadScript } from '@react-google-maps/api';
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:3002')
const Mp = ({coordinates}) => {
  const [co,setCo] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDUjGb_Qcsw5zphMctknUGVN5hz7BQF_ZY", 
  });

  

  // const [unmountMap, setunmountMap] = useState(false); 
  // useLayoutEffect(() => { 
  //   setunmountMap(false); 
  //   return () => { setunmountMap(true); }; 
  // }, []);

  const [currentLocation, setCurrentLocation] = useState([]);
  console.log(coordinates);

  useEffect(() => {
    // socket.on('location', (message) => {
    //   setCurrentLocation([message.lat, message.lng]);
    //   setCo((prev) => {prev[0]={lat:message.lat,lng:message.lng}; return prev;});
    // });
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      //update the first coordinate to the current location
      setCo((prev) => {prev[0]={lat:position.coords.latitude,lng:position.coords.longitude}; return prev;});

    });
    setCo(coordinates);
  
  }, [coordinates]);
  if (loadError) return <h1>Error loading maps</h1>;
if (!isLoaded) return <h1 className='text-white'>Loading</h1>;
  // if (unmountMap)  return "loading map...";
  return (
    currentLocation.length > 0 && (
      <>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: currentLocation[0], lng: currentLocation[1] }}
        zoom={40}
        mapTypeId={window.google.maps.MapTypeId.SATELLITE} // set map mode to satellite
        options={{
          disableDefaultUI: true, 
          clickableIcons: false, 
        
        }}
      >
        {co.map((coordinate, index) => {
          console.log(coordinate.lat, coordinate.lng)
          return (
            <>
            <Marker  key={index} position={{ lat: parseFloat(coordinate.lat), lng: parseFloat(coordinate.lng) }} icon={{
            url: index === 0 ? '/marker.png' : '/marker2.png',
            scaledSize: window.google && window.google.maps ? new window.google.maps.Size(70, 70) : undefined, 
          }} />
         
          </>
          )
        })}
       
      </GoogleMap>
        </>
    )
  );
};

export default Mp;
