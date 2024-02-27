'use client'
import { LineChart } from '@mui/x-charts'
import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
const socket = io('http://192.168.126.189:5002')
function Basic() {
  const [Temperature, setTemperature] = React.useState([])
  const [Humidity, setHumidity] = React.useState([])
  const [ph, setPh] = React.useState([])
  const [NH, setNH] = React.useState([])
  const [time1,setTime1] = React.useState([]);
  const [time2,setTime2] = React.useState([]);
  const [time3,setTime3] = React.useState([]);
  const [time4,setTime4] = React.useState([]);
  useEffect(() => {
    // Listen for incoming messages
    socket.on('Temperature', (message) => {
      if(Temperature.length===6){
        setTemperature(old=>old.shift())
        setTime1(old=>old.shift())
      }
      else {setTemperature(old=>[...old,message])
        //date in hh:mm:ss
        const date = new Date();
        const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        setTime1(old=>[...old,time])
      }

    })
    socket.on('Humidity', (message) => {
      if(Humidity.length===6){
       setHumidity(old=>old.shift())
       setTime2(old=>old.shift())
      }
      else {setHumidity(old=>[...old,message])
        const date = new Date();
        const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        setTime2(old=>[...old,time])
      }
    })
    socket.on('ph', (message) => {
      if(ph.length===6){
        setPh(old=>old.shift())
        setTime3(old=>old.shift())
      }
      else {setPh(old=>[...old,message])
        const date = new Date();
        const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        setTime3(old=>[...old,time])
      }
      
    })
    socket.on('Ammonia', (message) => {
      if(NH.length===6){
        setNH(old=>old.shift())
        setTime4(old=>old.shift())
      }
      else {setNH(old=>[...old,message])
        const date = new Date();
        const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        setTime4(old=>[...old,time])
      }
    })
  }, [])
 
 
  return (
    <div className="m-4">
      {/* basic sensor info - text */}
      <h1 className='text-4xl text-center mt-2 mb-2'>Sensor Data</h1>
      <div className="border flex flex-row justify-between bg-white/10 backdrop-blur-md rounded-xl m-auto text-center p-4">
        <h1 className='text-5xl'>{Temperature[Temperature.length-1]}°C</h1>
        <h1 className='text-5xl'>{ph[ph.length-1]} PH</h1>
        <h1 className='text-5xl'>{Humidity[Humidity.length-1]} %</h1>
        <h1 className='text-5xl'>{NH[NH.length-1]} PPM</h1>
      </div>
      {/* basic sensor info - chart */}

      <div className="grid grid-cols-2 m-2">
        <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
          <LineChart 

            xAxis={[
              {
                scaleType: 'point',
                data: time2.slice(-8),
              },
            ]}
            series={[
             
              {
                data: Humidity.slice(-8), 
                label: 'Humidity',
              },
            ]}
            width={600}
            height={300}
            sx={{
              '& .MuiChartsAxis-tickLabel': {
                color: 'white',
                fill: 'white !important',
              },
              '& .MuiChartsAxis-line': {
                stroke: 'white !important',
              }, 
              '&': {
                stroke: 'white !important',
              },
            }}
          />
          <h1 className="text-center">Humidity Data</h1>
        </div>

        <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
          <LineChart
            xAxis={[
              {
                curve: "monotoneX",
                scaleType: 'point',
                data: time3.slice(-8),
              },
            ]}
            series={[
             
              {
                data: ph.slice(-8),
                label: 'PH value',
              },
            ]}
            width={600}
            height={300}
            sx={{
              '& .MuiChartsAxis-tickLabel': {
                color: 'white',
                fill: 'white !important',
              },
              '& .MuiChartsAxis-line': {
                stroke: 'white !important',
              },
              '&': {
                stroke: 'white !important',
              },
            }}
          />
          <h1 className="text-center">PH Sensor Data</h1>
        </div>

        <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data: time1.slice(-8),
              },
            ]}
            series={[
              
              {
                data: Temperature.slice(-8),
                label: 'Temperature(°C)',
              },
            ]}
            width={600}
            height={300}
            sx={{
              '& .MuiChartsAxis-tickLabel': {
                color: 'white',
                fill: 'white !important',
              },
              '& .MuiChartsAxis-line': {
                stroke: 'white !important',
              },
              '&': {
                stroke: 'white !important',
              },
            }}
          />
          <h1 className="text-center">Temperature Sensor Data</h1>
        </div>

        

        <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data:time4.slice(-8) ,
              },
            ]}
            series={[
              
              {
                data: NH.slice(-8),
                label: 'Value of NH3',
              },
            ]}
            width={600}
            height={300}
            sx={{
              '& .MuiChartsAxis-tickLabel': {
                color: 'white',
                fill: 'white !important',
              },
              '& .MuiChartsAxis-line': {
                stroke: 'white !important',
              },
              '& text': {  
                fill: 'white !important',
              },
            }}
          />
          <h1 className="text-center">NH3 Data</h1>
        </div>
      </div>
    </div>
  )
}

export default Basic
