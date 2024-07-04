'use client'
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
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
  });
  const [labels, setLabels] = useState([]);

  useEffect(() => { 
    const socket = io('http://192.168.68.103:5000');

    socket.on('connect', () => { 
      console.log('Connected to server');
    });

    socket.on('sensor_data', (sensorData) => {
      console.log('Received sensor data:', sensorData)
      const parsedData = sensorData.split(',').map(Number);
      if (parsedData.length === 7) {
        const [humidity, temperature, conductivity, ph, nitrogen, phosphorus, potassium] = parsedData;

        // Use functional updates to ensure correct state updates
        setData(prevData => ({
          humidity: updateDataArray(prevData.humidity, humidity),
          temperature: updateDataArray(prevData.temperature, temperature),
          conductivity: updateDataArray(prevData.conductivity, conductivity),
          ph: updateDataArray(prevData.ph, ph),
          nitrogen: updateDataArray(prevData.nitrogen, nitrogen),
          phosphorus: updateDataArray(prevData.phosphorus, phosphorus),
          potassium: updateDataArray(prevData.potassium, potassium),
        }));
        setLabels(prevLabels => updateDataArray(prevLabels, new Date().toLocaleTimeString()));
      } else {
        console.error('Received invalid sensor data:', sensorData);
      }
    });

    // // // Clean up the socket connection on component unmount
    return () => {
      console.log('Disconnecting socket')
      socket.disconnect();
    };
  }, []);

  const updateDataArray = (arr, newValue) => {
    return [...arr.slice(-9), newValue];
  };

  const generateChart = (label, color, dataKey) => {
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
            text: 'Value',
          },
          beginAtZero: true,
        },
      },
    };

    return (
      <div className="chart-container" key={dataKey}>
        <h2>{label}</h2>
        <Line data={chartData} options={options} />
      </div>
    );
  };

  return (
    <div className="sensor-charts">
      <h1>Real-time Sensor Data</h1>
      {generateChart('Humidity', 'blue', 'humidity')}
      {generateChart('Temperature', 'red', 'temperature')}
      {generateChart('Conductivity', 'green', 'conductivity')}
      {generateChart('pH', 'purple', 'ph')}
      {generateChart('Nitrogen', 'orange', 'nitrogen')}
      {generateChart('Phosphorus', 'brown', 'phosphorus')}
      {generateChart('Potassium', 'cyan', 'potassium')}
    </div>
  );
};

export default SensorChart;
