"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
})

type Waypoint = {
  id: number
  lat: number
  lng: number
}

function AnimatedMarker({
  waypoints,
  onPositionChange,
}: { waypoints: Waypoint[]; onPositionChange: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const map = useMap()

  useEffect(() => {
    if (waypoints.length === 0) return

    const animateMarker = () => {
      if (currentIndex >= waypoints.length) {
        return
      }

      const newPosition = L.latLng(waypoints[currentIndex].lat, waypoints[currentIndex].lng)
      setPosition(newPosition)
      map.panTo(newPosition)
      onPositionChange(newPosition.lat, newPosition.lng)

      setCurrentIndex((prevIndex) => prevIndex + 1)
    }

    const timer = setTimeout(animateMarker, 1000)
    return () => clearTimeout(timer)
  }, [currentIndex, waypoints, map, onPositionChange])

  return position ? (
    <Marker position={position} icon={L.icon({ iconUrl: "/animated-marker.png", iconSize: [25, 41] })} />
  ) : null
}

export default function MapComponent() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [userWaypoints, setUserWaypoints] = useState<Waypoint[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [inputLat, setInputLat] = useState("")
  const [inputLng, setInputLng] = useState("")
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [reachedWaypoint, setReachedWaypoint] = useState<Waypoint | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        try {
          const parsedWaypoints = JSON.parse(content)
          setWaypoints(parsedWaypoints.map((wp: Waypoint, index: number) => ({ ...wp, id: index })))
        } catch (error) {
          console.error("Error parsing JSON:", error)
          alert("Invalid JSON file. Please upload a valid waypoints file.")
        }
      }
      reader.readAsText(file)
    }
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
  }, [inputLat, inputLng])

  const startAnimation = useCallback(() => {
    setIsAnimating(true)
  }, [])

  const handlePositionChange = useCallback(
    (lat: number, lng: number) => {
      setCurrentPosition({ lat, lng })
      const matchedWaypoint = userWaypoints.find((wp) => wp.lat === lat && wp.lng === lng)
      if (matchedWaypoint) {
        setReachedWaypoint(matchedWaypoint)
      }
    },
    [userWaypoints],
  )

  const mapCenter = waypoints.length > 0 ? [waypoints[0].lat, waypoints[0].lng] : [23.8377, 90.3579]

  return (
    <div className="w-full max-w-7xl flex">
      <div className="w-1/3 p-4">
        <input type="file" accept=".json" onChange={handleFileUpload} ref={fileInputRef} style={{ display: "none" }} />
        <Button onClick={() => fileInputRef.current?.click()} className="mb-4">
          Upload Waypoints JSON
        </Button>
        <div className="mb-4">
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
          <Button onClick={addWaypoint}>Add Waypoint</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userWaypoints.map((waypoint) => (
              <TableRow key={waypoint.id}>
                <TableCell>{waypoint.id + 1}</TableCell>
                <TableCell>{waypoint.lat.toFixed(6)}</TableCell>
                <TableCell>{waypoint.lng.toFixed(6)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={startAnimation} disabled={isAnimating || waypoints.length === 0} className="mt-4">
          Start Animation
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
          center={mapCenter as [number, number]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "calc(100vh - 2rem)", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {waypoints.map((waypoint) => (
            <Marker key={waypoint.id} position={[waypoint.lat, waypoint.lng]} />
          ))}
          {isAnimating && <AnimatedMarker waypoints={waypoints} onPositionChange={handlePositionChange} />}
          <Polyline positions={waypoints.map((wp) => [wp.lat, wp.lng])} />
        </MapContainer>
      </div>
      <Dialog open={!!reachedWaypoint} onOpenChange={() => setReachedWaypoint(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waypoint Reached</DialogTitle>
          </DialogHeader>
          <p>Waypoint {reachedWaypoint?.id !== undefined ? reachedWaypoint.id + 1 : ""} has been reached!</p>
          <p>
            Latitude: {reachedWaypoint?.lat.toFixed(6)}, Longitude: {reachedWaypoint?.lng.toFixed(6)}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

