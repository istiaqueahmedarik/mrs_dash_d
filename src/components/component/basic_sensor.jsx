'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const SensorChart = () => {
  const [data, setData] = useState({
    humidity: [],
    temperature: [],
    conductivity: [],
    ph: [],
    nitrogen: [],
    phosphorus: [],
    potassium: [],
    ambient: [],
    presssure: []
  });
  const [labels, setLabels] = useState([]);

  // Commented out socket connection and event listeners
  /*
  useEffect(() => { 
    socket.on('connect', () => { 
      console.log('Connected to server');
    });
    socket.on('sensor_data', (sensorData) => {
      // ...existing socket code...
    });
  }, []);
  */

  // New useEffect to generate believable random sensor data every second
  useEffect(() => {
    const interval = setInterval(() => {
      const randomData = {
        humidity: 30 + Math.random() * 40,         // 30 to 70 (%)
        temperature: 15 + Math.random() * 20,        // 15 to 35 (°C)
        conductivity: 200 + Math.random() * 600,     // 200 to 800 (µS/cm)
        ph: 5.5 + Math.random() * 2.0,               // 5.5 to 7.5
        nitrogen: 20 + Math.random() * 60,           // 20 to 80 (mg/kg)
        phosphorus: 10 + Math.random() * 40,         // 10 to 50 (mg/kg)
        potassium: 20 + Math.random() * 40,          // 20 to 60 (mg/kg)
        ambient: 200 + Math.random() * 800,          // 200 to 1000 (Lux)
        presssure: 980 + Math.random() * 70          // 980 to 1050 (hPa)
      };

      setData(prevData => ({
        humidity: updateDataArray(prevData.humidity, randomData.humidity),
        temperature: updateDataArray(prevData.temperature, randomData.temperature),
        conductivity: updateDataArray(prevData.conductivity, randomData.conductivity),
        ph: updateDataArray(prevData.ph, randomData.ph),
        nitrogen: updateDataArray(prevData.nitrogen, randomData.nitrogen),
        phosphorus: updateDataArray(prevData.phosphorus, randomData.phosphorus),
        potassium: updateDataArray(prevData.potassium, randomData.potassium),
        ambient: updateDataArray(prevData.ambient, randomData.ambient),
        presssure: updateDataArray(prevData.presssure, randomData.presssure)
      }));
      setLabels(prevLabels => updateDataArray(prevLabels, new Date().toLocaleTimeString()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateDataArray = (arr, newValue) => {
    return [...arr.slice(-9), newValue];
  };

  const generateChart = (label, color, dataKey) => {
    const yAxisLabels = {
      humidity: 'Humidity (%)',
      temperature: 'Temperature (°C)',
      conductivity: 'Conductivity (µS/cm)',
      ph: 'pH',
      nitrogen: 'Nitrogen (mg/kg)',
      phosphorus: 'Phosphorus (mg/kg)',
      potassium: 'Potassium (mg/kg)',
      ambient: 'Ambient Light (Lux)',
      presssure: 'Pressure (hPa)'
    };
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data[dataKey],
          borderColor: color,
          borderWidth: 1,
          fill: false,
        },
      ],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false, // Allow chart to adjust its height
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          title: {
            display: true,
            text: yAxisLabels[dataKey] || 'Value',
          },
          beginAtZero: true,
        },
      },
    };
    return (
      <div className="chart-container w-full h-64" key={dataKey}>
        <h2>{label}</h2>
        <Line data={chartData} options={options} />
      </div>
    );
  };

  return (
    <div className="sensor-charts m-auto text-center p-4 ml-[5rem]">
      <h1 className='text-2xl mb-4'>Real-time Sensor Data</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {generateChart('Ambient', 'blue', 'ambient')}
        {generateChart('Temperature', 'red', 'temperature')}
        {generateChart('Humidity', 'green', 'humidity')}
        {generateChart('Pressure', 'purple', 'presssure')}
        {/* {generateChart('Nitrogen', 'orange', 'nitrogen')} */}
        {/* {generateChart('Phosphorus', 'brown', 'phosphorus')} */}
        {/* {generateChart('Potassium', 'cyan', 'potassium')} */}
      </div>
    </div>
  );
};

export default SensorChart;
