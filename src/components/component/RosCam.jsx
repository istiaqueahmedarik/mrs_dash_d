'use client'
import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

const CameraImageSubscriber = () => {
    const [selectedId, setSelectedId] = useState(0);
    const [messageData, setMessageData] = useState('');
    const [ros, setRos] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);

    // Initialize ROS connection once when component mounts.
    useEffect(() => {
        const rosConnection = new ROSLIB.Ros({
            url: 'ws://<your-ros-host>:9090' // replace with your ROS 2 host
        });

        rosConnection.on('connection', () => {
            console.log('Connected to ROS.');
        });

        rosConnection.on('error', (error) => {
            console.error('Error connecting to ROS: ', error);
        });

        rosConnection.on('close', () => {
            console.log('Connection to ROS closed.');
        });

        setRos(rosConnection);

        // Cleanup on unmount
        return () => {
            rosConnection.close();
        };
    }, []);

    // Subscribe to topic based on selectedId
    useEffect(() => {
        if (!ros) return;

        // Unsubscribe from previous topic if it exists.
        if (currentTopic) {
            currentTopic.unsubscribe();
        }

        const topicName = `/topic_camera_image_${selectedId}`;
        const topic = new ROSLIB.Topic({
            ros: ros,
            name: topicName,
            messageType: 'std_msgs/String'
        });
        setCurrentTopic(topic);

        topic.subscribe((message) => {
            // Update the message string state whenever a new message is received.
            setMessageData(message.data);
        });

        // Cleanup: unsubscribe when the selectedId changes or component unmounts.
        return () => {
            topic.unsubscribe();
        };
    }, [selectedId, ros]);

    // Handle dropdown selection change.
    const handleDropdownChange = (event) => {
        setSelectedId(parseInt(event.target.value, 10));
    };

    return (
        <div>
            <h2>Camera Image Subscriber</h2>
            <label htmlFor="camera-select">Select Camera ID: </label>
            <select id="camera-select" value={selectedId} onChange={handleDropdownChange}>
                {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                ))}
            </select>
            <div>
                <h3>Received Message:</h3>
                <p>{messageData}</p>
            </div>
        </div>
    );
};

export default CameraImageSubscriber;
