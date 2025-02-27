"use client"

import React from "react"
import { useState, useCallback, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/vercel.svg",
  iconUrl: "/vercel.svg",
})

// Updated AnimatedMarker with onFinish prop.
function AnimatedMarker({ waypoints, onPositionChange, onFinish }) {
  const [position, setPosition] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const map = useMap()

  useEffect(() => {
    if (waypoints.length === 0) return

    // Stop one waypoint before finish
    if (currentIndex < waypoints.length - 1) {
      const animateMarker = () => {
        const newPosition = L.latLng(waypoints[currentIndex].lat, waypoints[currentIndex].lng)
        setPosition(newPosition)
        map.panTo(newPosition)
        onPositionChange(newPosition.lat, newPosition.lng)
        if (currentIndex === waypoints.length - 2) {
          onFinish && onFinish(newPosition.lat, newPosition.lng)
        } else {
          setCurrentIndex((prevIndex) => prevIndex + 1)
        }
      }

      const timer = setTimeout(animateMarker, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, waypoints, map, onPositionChange, onFinish])

  return position ? (
    <Marker position={position} icon={L.icon({ iconUrl: "/rover.png", iconSize: [41, 41] })} />
  ) : null
}

export default function ARTracker() {
  const [waypoints, setWaypoints] = useState([])
  const [userWaypoints, setUserWaypoints] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [inputLat, setInputLat] = useState("")
  const [inputLng, setInputLng] = useState("")
  const [currentPosition, setCurrentPosition] = useState(null)
  const [reachedWaypoint, setReachedWaypoint] = useState(null)
  const [animatedPath, setAnimatedPath] = useState([])
  const [openAddModal, setOpenAddModal] = useState(false)

  useEffect(() => {
    fetch("/waypoints.json")
      .then((res) => res.json())
      .then((data) => {
        setWaypoints(data.map((wp, index) => ({ ...wp, id: index })))
      })
      .catch((error) => {
        console.error("Error reading waypoints.json:", error)
      })
  }, [])

  const addWaypoint = useCallback(() => {
    const lat = Number.parseFloat(inputLat)
    const lng = Number.parseFloat(inputLng)
    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid latitude and longitude")
      return
    }
    setUserWaypoints((prev) => [...prev, { id: prev.length, lat, lng }])
    setInputLat("")
    setInputLng("")
    setOpenAddModal(false)
  }, [inputLat, inputLng])

  const startAnimation = useCallback(() => {
    setIsAnimating(true)
    setAnimatedPath([])
  }, [])

  const handlePositionChange = useCallback(
    (lat, lng) => {
      setCurrentPosition({ lat, lng })
      setAnimatedPath((prev) => [...prev, [lat, lng]])
      const matchedWaypoint = userWaypoints.find((wp) => wp.lat === lat && wp.lng === lng)
      if (matchedWaypoint) {
        setReachedWaypoint(matchedWaypoint)
      }
    },
    [userWaypoints],
  )

  // New callback to handle finish: add finishing waypoint with isFinished flag and stop animation.
  const handleFinish = useCallback((lat, lng) => {
    setUserWaypoints((prev) => [...prev, { id: prev.length, lat, lng, isFinished: true }])
    setIsAnimating(false)
  }, [])

  const mapCenter = currentPosition
    ? [currentPosition.lat, currentPosition.lng]
    : waypoints.length > 0
    ? [waypoints[0].lat, waypoints[0].lng]
    : [23.8377, 90.3579]

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateHeading = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const toDeg = (value) => (value * 180) / Math.PI;
    const dLng = toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
    let brng = toDeg(Math.atan2(y, x));
    return (brng + 360) % 360;
  };

  return (
    <div className="w-full max-w-7xl flex">
      <div className="w-1/3 p-4">
        <Button onClick={() => setOpenAddModal(true)} className="mb-4">
          Add Waypoint
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Distance (km)</TableHead>
              <TableHead>Heading (°)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userWaypoints.map((waypoint) => (
              <TableRow key={waypoint.id}>
                <TableCell>{waypoint.id + 1}</TableCell>
                <TableCell>{waypoint.lat.toFixed(6)}</TableCell>
                <TableCell>{waypoint.lng.toFixed(6)}</TableCell>
                <TableCell>
                  {currentPosition
                    ? calculateDistance(currentPosition.lat, currentPosition.lng, waypoint.lat, waypoint.lng).toFixed(2)
                    : "-"}
                </TableCell>
                <TableCell>
                  {currentPosition
                    ? calculateHeading(currentPosition.lat, currentPosition.lng, waypoint.lat, waypoint.lng).toFixed(1)
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={startAnimation} disabled={isAnimating || waypoints.length === 0} className="mt-4">
          Start Mission
        </Button>
        {currentPosition && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Current Position:</h3>
            <p>Latitude: {currentPosition.lat.toFixed(6)}</p>
            <p>Longitude: {currentPosition.lng.toFixed(6)}</p>
          </div>
        )}
      </div>
      <div className="w-2/3">
        <MapContainer
          center={mapCenter}
          zoom={30}
          scrollWheelZoom={true}
          style={{ height: "calc(100vh - 2rem)", width: "100%", zIndex: -10 }}
          className="z-[-10]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {userWaypoints.map((wp) => (
            <Marker
              key={"user-" + wp.id}
              position={[wp.lat, wp.lng]}
              icon={L.icon({
                iconUrl:
                  (wp.isFinished || wp.id >= Math.max(userWaypoints.length - 20, 0))
                    ? "/ar.png"
                    : "/marker.png",
                iconSize: [20, 20],
              })}
            />
          ))}
          {!isAnimating && (currentPosition ? (
            <Marker
              position={[currentPosition.lat, currentPosition.lng]}
              icon={L.icon({ iconUrl: "/rover.png", iconSize: [41, 41] })}
            />
          ) : (
            waypoints.length > 0 && (
              <Marker
                position={[waypoints[0].lat, waypoints[0].lng]}
                icon={L.icon({ iconUrl: "/rover.png", iconSize: [41, 41] })}
              />
            )
          ))}
          {isAnimating && (
            <AnimatedMarker
              waypoints={waypoints}
              onPositionChange={handlePositionChange}
              onFinish={handleFinish}
            />
          )}
          <Polyline positions={animatedPath} />
        </MapContainer>
      </div>
      <Dialog open={!!reachedWaypoint} onOpenChange={() => setReachedWaypoint(null)} className="z-9999">
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Waypoint Reached</DialogTitle>
          </DialogHeader>
          <p>Waypoint {reachedWaypoint?.id !== undefined ? reachedWaypoint.id + 1 : ""} has been reached!</p>
          <p>
            Latitude: {reachedWaypoint?.lat.toFixed(6)}, Longitude: {reachedWaypoint?.lng.toFixed(6)}
          </p>
        </DialogContent>
      </Dialog>
      <Dialog open={openAddModal} onOpenChange={setOpenAddModal} className="z-9999">
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Add Waypoint</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Latitude"
            value={inputLat}
            onChange={(e) => setInputLat(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Longitude"
            value={inputLng}
            onChange={(e) => setInputLng(e.target.value)}
            className="mb-2"
          />
          <Button onClick={addWaypoint}>Submit</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

