"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import GaugeChart from "react-gauge-chart"
import { PinContainer } from "../ui/tdpin"
import { Fan } from "lucide-react"

const batteryData = [
  { time: "1h", charge: 100 },
  { time: "2h", charge: 98 },
  { time: "3h", charge: 97 },
  { time: "4h", charge: 95 },
  { time: "5h", charge: 94 },
  { time: "6h", charge: 92 },
  { time: "7h", charge: 90 },
  { time: "8h", charge: 88 },
  { time: "9h", charge: 85 },
  { time: "10h", charge: 80 },
  { time: "11h", charge: 75 },
  { time: "12h", charge: 70 },
]

const cellData = [
  { name: "C1", voltage: 3.0 },
  { name: "C2", voltage: 2.9 },
  { name: "C3", voltage: 2.75 },
  { name: "C4", voltage: 3.2 },
  { name: "C5", voltage: 3.12 },
  { name: "C6", voltage: 3.15 },
  { name: "C7", voltage: 3.0 },
  { name: "C8", voltage: 2.75 },
  { name: "C9", voltage: 2.5 },
]

const tempData = [
  { time: "1h", temp: 25 },
  { time: "2h", temp: 28 },
  { time: "3h", temp: 30 },
  { time: "4h", temp: 26 },
  { time: "5h", temp: 35 },
  { time: "6h", temp: 28 },
  { time: "7h", temp: 20 },
  { time: "8h", temp: 25 },
]

export default function ElectricalDashboard() {
  const [voltage, setVoltage] = useState(24.0)
  const [temperature, setTemperature] = useState(45.0)
  const [currentDraw, setCurrentDraw] = useState(3.4)
  const [fanSpeed, setFanSpeed] = useState(1800.0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVoltage((v) => Number((v - 0.3).toFixed(2)))
      setTemperature((t) => Number((Math.random() * 10 + 40).toFixed(2)))
      setCurrentDraw((c) => Number((Math.random() * 2 + 2).toFixed(2)))
      setFanSpeed((f) => Number((Math.random() * 200 + 1700).toFixed(2)))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-4 ml-20">
      <h1 className="text-3xl font-bold text-center mb-4">Electrical Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-green-500/20 col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="relative">
              <p className="text-lg text-zinc-400">Current Voltage:</p>
              <h2 className="text-5xl font-bold mt-1 text-white">{voltage}V</h2>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl -z-10" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-green-500/20 col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="relative">
              <p className="text-lg text-zinc-400">Current Draw:</p>
              <h2 className="text-5xl font-bold mt-1 text-white">{currentDraw}A</h2>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl -z-10" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-green-500/20 text-white">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Battery Charge</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={batteryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 10 }} />
                <YAxis stroke="#888" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="charge" stroke="#4ade80" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-green-500/20 text-white">
          <CardContent className="p-4">
            <div className="relative">
              <p className="text-lg text-zinc-400">Current Temperature:</p>
              <h2 className="text-5xl font-bold mt-1 text-white">{temperature}°C</h2>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl -z-10" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-green-500/20 col-span-2 lg:col-span-1 text-white">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Current Fan Speed</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative">
             
              <p>
                <Fan
                  size={150}
                  className="text-green-500"
                  style={{
                    animation: `spin ${60 / (fanSpeed*0.04)}s linear infinite`
                  }}
                />
              </p>
              <h2 className="text-3xl font-bold mt-1 text-white">{fanSpeed} rpm</h2>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl -z-10" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-green-500/20 text-white col-span-2">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Cell Voltage</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cellData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 10 }} />
                <YAxis stroke="#888" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="voltage" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-green-500/20 text-white">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">Current Flow</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-2 max-h-[18rem]">
            <PinContainer title="Current Flow is: 3.4A">
              <GaugeChart
                id="gauge-chart5"
                nrOfLevels={420}
                arcsLength={[0.3, 0.5, 0.2]}
                colors={["#5BE12C", "#F5CD19", "#EA4228"]}
                percent={0.87}
                arcPadding={0.02}
                cornerRadius={0}
                textColor="#ffffff"
              />
              <h2 className="text-center text-sm mt-2">Current Flow Percentage</h2>
            </PinContainer>
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}

