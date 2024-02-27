"use client"
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from "leaflet"

const ICON = icon({
  iconUrl: "/marker.png",
  iconSize: [22, 22],
})

const ICON2 = icon({
  iconUrl: "/marker2.png",
  iconSize: [22, 22],
})

const Mp = ({coordinates}) => {
  const [unmountMap, setunmountMap] = useState(false); 
  useLayoutEffect(() => { 
    setunmountMap(false); 
    return () => { setunmountMap(true); }; 
  }, []);

  const [currentLocation, setCurrentLocation] = useState([]);
  console.log(coordinates);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
    });
  
  }, []);
  if (unmountMap)  return "loading map...";
  return (
    currentLocation.length > 0 ?
      
      <MapContainer center={currentLocation} zoom={80} scrollWheelZoom={false} >
        
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {coordinates.map((coordinate, index) => {
      console.log("position",[coordinate.lat,coordinate.lng])
      return (
        <Marker key={index} position={[parseFloat(coordinate.lat),parseFloat(coordinate.lng)]} icon={index===1?ICON2:ICON}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      );
    })}
      
  </MapContainer>
      :null
  );
};

export default Mp;
