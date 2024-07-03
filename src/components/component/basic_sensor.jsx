// 'use client'
// import { LineChart } from '@mui/x-charts'
// import React, { useEffect } from 'react'
// import { io } from 'socket.io-client'
// const socket = io('http://localhost:5000')
// function Basic() {
//   const [Temperature, setTemperature] = React.useState([])
//   const [Humidity, setHumidity] = React.useState([])
//   const [ph, setPh] = React.useState([])
//   const [NH, setNH] = React.useState([])
//   const [time1,setTime1] = React.useState([]);
//   const [time2,setTime2] = React.useState([]);
//   const [time3,setTime3] = React.useState([]);
//   const [time4,setTime4] = React.useState([]);
//   useEffect(() => {
//     // Listen for incoming messages
//     socket.on('location',(message)=>{
//       console.log(message)
//     })
//     socket.on('Temperature', (message) => {
//       if(Temperature.length===6){
//         setTemperature(old=>old.shift())
//         setTime1(old=>old.shift())
//       }
//       else {setTemperature(old=>[...old,message])
//         //date in hh:mm:ss
//         const date = new Date();
//         const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
//         setTime1(old=>[...old,time])
//       }

//     })
//     socket.on('Humidity', (message) => {
//       if(Humidity.length===6){
//        setHumidity(old=>old.shift())
//        setTime2(old=>old.shift())
//       }
//       else {setHumidity(old=>[...old,message])
//         const date = new Date();
//         const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
//         setTime2(old=>[...old,time])
//       }
//     })
//     socket.on('ph', (message) => {
//       if(ph.length===6){
//         setPh(old=>old.shift())
//         setTime3(old=>old.shift())
//       }
//       else {setPh(old=>[...old,message])
//         const date = new Date();
//         const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
//         setTime3(old=>[...old,time])
//       }
      
//     })
//     socket.on('Ammonia', (message) => {
//       if(NH.length===6){
//         setNH(old=>old.shift())
//         setTime4(old=>old.shift())
//       }
//       else {setNH(old=>[...old,message])
//         const date = new Date();
//         const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
//         setTime4(old=>[...old,time])
//       }
//     })
//   }, [])
 
 
//   return (
//     <div className="m-4">
//       {/* basic sensor info - text */}
//       <h1 className='text-4xl text-center mt-2 mb-2'>Sensor Data</h1>
//       <div className="border flex flex-row justify-between bg-white/10 backdrop-blur-md rounded-xl m-auto text-center p-4">
//         <h1 className='text-5xl'>{Temperature[Temperature.length-1]}°C</h1>
//         <h1 className='text-5xl'>{ph[ph.length-1]} PH</h1>
//         <h1 className='text-5xl'>{Humidity[Humidity.length-1]} %</h1>
//         <h1 className='text-5xl'>{NH[NH.length-1]} PPM</h1>
//       </div>
//       {/* basic sensor info - chart */}

//       <div className="grid grid-cols-2 m-2">
//         <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
//           <LineChart

//             xAxis={[
//               {
//                 scaleType: 'point',
//                 data: time2.slice(-8),
//               },
//             ]}
//             series={[
             
//               {
//                 data: Humidity.slice(-8),
//                 label: 'Humidity(%)',
//               },
//             ]}
//             width={600}
//             height={300}
//             sx={{
//               '& .MuiChartsAxis-tickLabel': {
//                 color: 'white',
//                 fill: 'white !important',
//               },
//               '& .MuiChartsAxis-line': {
//                 stroke: 'white !important',
//               },
//               '&': {
//                 stroke: 'white !important',
//               },
//             }}
//           />
//           <h1 className="text-center">Humidity Data</h1>
//         </div>

//         <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
//           <LineChart
//             xAxis={[
//               {
//                 curve: "monotoneX",
//                 scaleType: 'point',
//                 data: time3.slice(-8),
//               },
//             ]}
//             series={[
             
//               {
//                 data: ph.slice(-8),
//                 label: 'PH value',
//               },
//             ]}
//             width={600}
//             height={300}
//             sx={{
//               '& .MuiChartsAxis-tickLabel': {
//                 color: 'white',
//                 fill: 'white !important',
//               },
//               '& .MuiChartsAxis-line': {
//                 stroke: 'white !important',
//               },
//               '&': {
//                 stroke: 'white !important',
//               },
//             }}
//           />
//           <h1 className="text-center">PH Sensor Data</h1>
//         </div>

//         <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
//           <LineChart
//             xAxis={[
//               {
//                 scaleType: 'point',
//                 data: time1.slice(-8),
//               },
//             ]}
//             series={[
              
//               {
//                 data: Temperature.slice(-8),
//                 label: 'Temperature(°C)',
//               },
//             ]}
//             width={600}
//             height={300}
//             sx={{
//               '& .MuiChartsAxis-tickLabel': {
//                 color: 'white',
//                 fill: 'white !important',
//               },
//               '& .MuiChartsAxis-line': {
//                 stroke: 'white !important',
//               },
//               '&': {
//                 stroke: 'white !important',
//               },
//             }}
//           />
//           <h1 className="text-center">Temperature Sensor Data</h1>
//         </div>

        

//         <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
//           <LineChart
//             xAxis={[
//               {
//                 scaleType: 'point',
//                 data:time4.slice(-8) ,
//               },
//             ]}
//             series={[
              
//               {
//                 data: NH.slice(-8),
//                 label: 'NH3(PPM)',
//               },
//             ]}
//             width={600}
//             height={300}
//             sx={{
//               '& .MuiChartsAxis-tickLabel': {
//                 color: 'white',
//                 fill: 'white !important',
//               },
//               '& .MuiChartsAxis-line': {
//                 stroke: 'white !important',
//               },
//               '& text': {
//                 fill: 'white !important',
//               },
//             }}
//           />
//           <h1 className="text-center">NH3 Data</h1>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Basic


'use client'
import { LineChart } from '@mui/x-charts'
import React, { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

function Basic() {
  // State for sensor data
  const [temperature, setTemperature] = React.useState([])
  const [humidity, setHumidity] = React.useState([])
  const [ph, setPh] = React.useState([])
  const [ammonia, setAmmonia] = React.useState([])
  const [nitrogen, setNitrogen] = React.useState([])
  const [phosphorus, setPhosphorus] = React.useState([])
  const [potassium, setPotassium] = React.useState([])
  const [conductivity, setConductivity] = React.useState([])


  // State for timestamps
  const [timeTemperature, setTimeTemperature] = React.useState([])
  const [timeHumidity, setTimeHumidity] = React.useState([])
  const [timePh, setTimePh] = React.useState([])
  const [timeAmmonia, setTimeAmmonia] = React.useState([])
  const [timeNitrogen, setTimeNitrogen] = React.useState([])
  const [timePhosphorus, setTimePhosphorus] = React.useState([])
  const [timePotassium, setTimePotassium] = React.useState([])
  const [timeConductivity, setTimeConductivity] = React.useState([])

  /**
   * 
   *  sensor_data = {
                "humidity": humidity,
                "temperature": temperature,
                "conductivity": conductivity,
                "ph": ph,
                "nitrogen": nitrogen,
                "phosphorus": phosphorus,
                "potassium": potassium
            }
   */
  useEffect(() => {
    // Handle incoming sensor data
    socket.on('sensor_data', (data) => {
      console.log('Received data:', data)

      const currentTime = new Date().toLocaleTimeString()

      // Update temperature data
      setTemperature((prev) => {
        const updated = [...prev, data.temperature]
        return updated.slice(-8)  // Keep last 8 values
      })
      setTimeTemperature((prev) => {
        const updated = [...prev, currentTime]
        return updated.slice(-8)
      })

      // Update humidity data
      setHumidity((prev) => {
        const updated = [...prev, data.humidity]
        return updated.slice(-8)
      })
      setTimeHumidity((prev) => {
        const updated = [...prev, currentTime]
        return updated.slice(-8)
      })

      // Update pH data
      setPh((prev) => {
        const updated = [...prev, data.ph]
        return updated.slice(-8)
      })
      setTimePh((prev) => {
        const updated = [...prev, currentTime]
        return updated.slice(-8)
      })

      // Update ammonia data
      setAmmonia((prev) => {
        const updated = [...prev, data.ammonia]  // Use ammonia from data
        return updated.slice(-8)
      })
      setTimeAmmonia((prev) => {
        const updated = [...prev, currentTime]
        return updated.slice(-8)
      })

      // Update nitrogen data
      setNitrogen((prev) => {
        const updated = [...prev, data.nitrogen]  // Use nitrogen from data
        return updated.slice(-8)
      })
      setTimeNitrogen((prev) => {
        const updated = [...prev, currentTime]
        return updated.slice(-8)
      })

      // Update phosphorus data
      setPhosphorus((prev) => {
        const updated = [...prev, data.phosphorus]  // Use phosphorus from data
        return updated.slice(-8)
      })
      setTimePhosphorus((prev) => {
        const updated = [...prev, currentTime]
        return updated.slice(-8)
      })

      // Update potassium data
      setPotassium((prev) => {
        const updated = [...prev, data.potassium]  // Use potassium from data
        return updated.slice(-8)
      })
      setTimePotassium((prev) => {
        const updated = [...prev, currentTime]
        return updated.slice(-8)
      })

      // Update conductivity data
      setConductivity((prev) => {
        const updated = [...prev, data.conductivity]  // Use conductivity from data
        return updated.slice(-8)
      })
      setTimeConductivity((prev) => {
        const updated = [...prev, currentTime]
        return updated.slice(-8)
      })



    })

    // Clean up socket on component unmount
    return () => socket.off('sensor_data')
  }, [])

  return (
    <div className="m-4">
      {/* Basic sensor info - text */}
      <h1 className='text-4xl text-center mt-2 mb-2'>Sensor Data</h1>
      <div className="border flex flex-row justify-between bg-white/10 backdrop-blur-md rounded-xl m-auto text-center p-4">
        <h1 className='text-5xl'>{temperature[temperature.length - 1]?.toFixed(1)}°C</h1>
        <h1 className='text-5xl'>{ph[ph.length - 1]?.toFixed(1)} PH</h1>
        <h1 className='text-5xl'>{humidity[humidity.length - 1]?.toFixed(1)} %</h1>
        <h1 className='text-5xl'>{ammonia[ammonia.length - 1]?.toFixed(1)} PPM</h1>
      </div>

      {/* Sensor data - charts */}
      <div className="grid grid-cols-2 m-2">
        <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data: timeTemperature,
              },
            ]}
            series={[
              {
                data: temperature,
                label: 'Temperature (°C)',
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
                data: timeHumidity,
              },
            ]}
            series={[
              {
                data: humidity,
                label: 'Humidity (%)',
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
                scaleType: 'point',
                data: timePh,
              },
            ]}
            series={[
              {
                data: ph,
                label: 'pH Value',
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
          <h1 className="text-center">pH Sensor Data</h1>
        </div>
{/* 
        <div className="text-white ml-auto mr-auto mt-6 mb-6 w-fit rounded-xl p-6 bg-white/10 backdrop-blur-md">
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data: timeAmmonia,
              },
            ]}
            series={[
              {
                data: ammonia,
                label: 'Ammonia (PPM)',
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
          <h1 className="text-center">Ammonia Data</h1>
        </div> */}
        <div>
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data: timeNitrogen,
              },
            ]}
            series={[
              {
                data: nitrogen,
                label: 'Nitrogen (PPM)',
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
          <h1 className="text-center">Nitrogen Data</h1>
        </div>
        <div>
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data: timePhosphorus,
              },
            ]}
            series={[
              {
                data: phosphorus,
                label: 'Phosphorus (PPM)',
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
          <h1 className="text-center">Phosphorus Data</h1>
        </div>
        <div>
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data: timePotassium,
              },
            ]}
            series={[
              {
                data: potassium,
                label: 'Potassium (PPM)',
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
          <h1 className="text-center">Potassium Data</h1>
        </div>
        <div>
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data: timeConductivity,
              },
            ]}
            series={[
              {
                data: conductivity,
                label: 'Conductivity (PPM)',
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
          <h1 className="text-center">Conductivity Data</h1>
        </div>
        

        </div>
        
    </div>
  )
}

export default Basic
