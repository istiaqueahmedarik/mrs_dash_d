"use client"

import { useState, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Crosshair } from "lucide-react"
import { Dialog as MissionDialog, DialogContent as MissionDialogContent, DialogHeader as MissionDialogHeader, DialogTitle as MissionDialogTitle, DialogTrigger as MissionDialogTrigger } from "@/components/ui/dialog"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface Marker {
  id: number
  latitude: number
  longitude: number
  distance: number
  heading: number
  checked: boolean
}

export default function GPSTracker({ lat1, lng1 }: any) {
  const [markers, setMarkers] = useState<Marker[]>([])
  const [newMarker, setNewMarker] = useState({ latitude: "", longitude: "" })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(lng1)
  const [lat, setLat] = useState(lat1)
  const [zoom, setZoom] = useState(9)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const currentLocationMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const pathRef = useRef<mapboxgl.AnySourceImpl | null>(null)
  const animationRef = useRef<number | null>(null)
  const [buttonText, setButtonText] = useState("Start Simulation")
  const [missionCompleteModalOpen, setMissionCompleteModalOpen] = useState(false)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng1, lat1],
      zoom: zoom,
    })

    // const el = document.createElement("div")
    // setCurrentLocation([lng, lat])
    // el.className = "current-location-marker"
    // el.innerHTML = '<img src="/logo.png" style="width: 50px; height: 30px; border-radius: 50%; border: 2px solid #FFFFFF" />'
    // el.style.color = "#FF0000"
    // el.style.width = "30px"
    // el.style.height = "30px"
    // currentLocationMarkerRef.current = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current)


    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Repeatedly try to get and set the user's current location
    if ("geolocation" in navigator) {
      const attemptGetLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            setCurrentLocation([longitude, latitude]);
            setLng(longitude);
            setLat(latitude);
            map.current?.flyTo({ center: [longitude, latitude], zoom: 14 });
            // Create a custom marker element if not already set:
            if (!currentLocationMarkerRef.current) {
              const el = document.createElement("div");
              el.className = "current-location-marker";
              el.innerHTML =
                '<img src="/logo.png" style="width: 50px; height: 30px; border-radius: 50%; border: 2px solid #FFFFFF" />';
              el.style.color = "#FF0000";
              el.style.width = "30px";
              el.style.height = "30px";
              currentLocationMarkerRef.current = new mapboxgl.Marker(el)
                .setLngLat([longitude, latitude])
                .addTo(map.current!);
            } else {
              currentLocationMarkerRef.current.setLngLat([longitude, latitude]);
            }
          },
          (error) => {
            console.error("Location error, trying again...", error);
            setTimeout(attemptGetLocation, 2000);
          }
        );
      };
      attemptGetLocation();
    }

  }, [])

  useEffect(() => {
    if (!map.current) return
    map.current.on("move", () => {
      if (!map.current) return
      setLng(Number.parseFloat(map.current.getCenter().lng.toFixed(4)))
      setLat(Number.parseFloat(map.current.getCenter().lat.toFixed(4)))
      setZoom(Number.parseFloat(map.current.getZoom().toFixed(2)))
    })
  }, [])

  // Add a conditional useEffect to update user's location every 2 seconds during simulation:
  useEffect(() => {
    if (buttonText !== "Stop Simulation") return;
    const watchId = navigator.geolocation.watchPosition((position) => {
      const { longitude, latitude } = position.coords;
      console.log("Updated location:", [longitude, latitude]);
      setCurrentLocation([longitude, latitude]);
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setLngLat([longitude, latitude]);
      }
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [buttonText]);

  // Add a useEffect to check distance and mark checked if within 3 m:
  useEffect(() => {
    if (currentLocation) {
      let updated = false;
      const newMarkers = markers.map((marker) => {
        if (!marker.checked && computeDistance(currentLocation, [marker.longitude, marker.latitude]) < 3) {
          updated = true;
          return { ...marker, checked: true }
        }
        return marker;
      });
      if (updated) {
        setMarkers(newMarkers);
        setMissionCompleteModalOpen(true);
      }
    }
  }, [currentLocation]);

  // Add helper function to generate a curved path:
  const generateCurvedPath = (points: [number, number][]): [number, number][] => {
    const curve: [number, number][] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mid: [number, number] = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      const dx = p1[0] - p0[0];
      const dy = p1[1] - p0[1];
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      const offset = 0.001; // small offset for curve effect
      const offsetX = -dy / length * offset;
      const offsetY = dx / length * offset;
      const control: [number, number] = [mid[0] + offsetX, mid[1] + offsetY];
      const samples = 50;
      const segment: [number, number][] = [];
      for (let t = 0; t <= samples; t++) {
        const u = t / samples;
        const x = (1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * control[0] + u * u * p1[0];
        const y = (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * control[1] + u * u * p1[1];
        segment.push([x, y]);
      }
      if (i > 0) segment.shift(); // remove duplicate point
      curve.push(...segment);
    }
    return curve;
  };

  const startSimulation = () => {
    if (!map.current || markers.length === 0) return;
    setButtonText("Stop Simulation");

    // Build path: start with currentLocation (if exists) then all marker coordinates
    const startPoint: [number, number] = currentLocation || [markers[0].longitude, markers[0].latitude];
    const rawPath: [number, number][] = [startPoint, ...markers.map(marker => [marker.longitude, marker.latitude])];
    const curvedPath = generateCurvedPath(rawPath);

    // Create simulation marker (custom marker)
    if (!markerRef.current) {
      const customMarker = document.createElement("div");
      customMarker.className = "custom-marker";
      customMarker.style.backgroundImage = "url('/vercel.svg')";
      customMarker.style.width = "10px";
      customMarker.style.height = "10px";
      customMarker.style.backgroundSize = "cover";
      markerRef.current = new mapboxgl.Marker(customMarker).setLngLat(startPoint).addTo(map.current);
    }

    let index = 0;
    const totalPoints = curvedPath.length;
    const delay = 1;

    const animate = () => {
      if (index >= totalPoints) return;
      const [lng, lat] = curvedPath[index];
      markerRef.current?.setLngLat([lng, lat]);
      map.current?.setCenter([lng, lat]);
      index++;
      setTimeout(animate, delay);
    };

    animate();
  };

  const addMarker = () => {
    const lat = Number.parseFloat(newMarker.latitude)
    const lng = Number.parseFloat(newMarker.longitude)
    if (isNaN(lat) || isNaN(lng)) return

    const newId = markers.length > 0 ? Math.max(...markers.map((m) => m.id)) + 1 : 1
    const newMarkerObj: Marker = {
      id: newId,
      latitude: lat,
      longitude: lng,
      distance: 0,
      heading: 0,
      checked: false,
    }
    setMarkers([...markers, newMarkerObj])
    setNewMarker({ latitude: "", longitude: "" })
    setIsModalOpen(false)
  }

  const deleteMarker = (id: number) => {
    setMarkers(markers.filter((marker) => marker.id !== id))
  }

  const toggleMarker = (id: number) => {
    setMarkers(markers.map((marker) => (marker.id === id ? { ...marker, checked: !marker.checked } : marker)))
  }

  const centerOnCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords
        setCurrentLocation([longitude, latitude])
        map.current?.flyTo({ center: [longitude, latitude], zoom: 14 })
        currentLocationMarkerRef.current?.setLngLat([longitude, latitude])
      })
    }
  }

  // Add helper functions to compute distance and heading
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const computeDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371000; // Earth radius in meters
    const lat1 = toRadians(coord1[1]);
    const lat2 = toRadians(coord2[1]);
    const deltaLat = toRadians(coord2[1] - coord1[1]);
    const deltaLng = toRadians(coord2[0] - coord1[0]);
    const a = Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const computeHeading = (coord1: [number, number], coord2: [number, number]): number => {
    const lat1 = toRadians(coord1[1]);
    const lat2 = toRadians(coord2[1]);
    const deltaLng = toRadians(coord2[0]);
    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    let theta = Math.atan2(y, x) * (180 / Math.PI); // Convert to degrees
    return (theta + 360) % 360;
  };

  return (
    <div className="flex h-screen text-white">
      <div className="w-1/2 p-4 overflow-auto">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">
              <Plus className="mr-2 h-4 w-4" /> Add Marker
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Marker</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                type="number"
                placeholder="Latitude"
                value={newMarker.latitude}
                onChange={(e) => setNewMarker({ ...newMarker, latitude: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Longitude"
                value={newMarker.longitude}
                onChange={(e) => setNewMarker({ ...newMarker, longitude: e.target.value })}
              />
              <Button onClick={addMarker}>Add Marker</Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* New Mission Complete Modal */}
        <MissionDialog open={missionCompleteModalOpen} onOpenChange={setMissionCompleteModalOpen}>
          <MissionDialogContent>
            <MissionDialogHeader>
              <MissionDialogTitle>Mission Complete</MissionDialogTitle>
            </MissionDialogHeader>
            <div>
              <p>A marker is reached within 3 meters.</p>
              <Button onClick={() => setMissionCompleteModalOpen(false)}>Close</Button>
            </div>
          </MissionDialogContent>
        </MissionDialog>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Distance(m)</TableHead>
              <TableHead>Heading</TableHead>
              <TableHead>Checked</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markers.map((marker, index) => (
              <TableRow key={marker.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{marker.latitude}</TableCell>
                <TableCell>{marker.longitude}</TableCell>
                <TableCell>
                  {currentLocation
                    ? computeDistance(currentLocation, [marker.longitude, marker.latitude])
                    : "-"}
                </TableCell>
                <TableCell>
                  {currentLocation
                    ? computeHeading(currentLocation, [marker.longitude, marker.latitude])
                    : "-"}
                </TableCell>
                <TableCell>
                  <Checkbox checked={marker.checked} onCheckedChange={() => toggleMarker(marker.id)} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => deleteMarker(marker.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-2 mt-4">
          <Button onClick={startSimulation}>{buttonText}</Button>

        </div>

      </div>
      <div className="w-1/2">
        <div ref={mapContainer} className="h-full" />
      </div>
    </div>
  )
}

