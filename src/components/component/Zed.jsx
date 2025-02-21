'use client'
import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

const Zed = () => {
    const [normalImage, setNormalImage] = useState(null);
    const [detectedImage, setDetectedImage] = useState(null);
    const [isLive, setIsLive] = useState(false);
    useEffect(() => {
        // Connect to the rosbridge WebSocket server.
        const ros = new ROSLIB.Ros({
            url: 'ws://192.168.0.101:9090'
        });

        ros.on('connection', () => {
            console.log('Connected to ROS bridge.');
            setIsLive(true);
        });
        ros.on('error', (error) => {
            console.error('Error connecting to ROS bridge:', error);
        });
        ros.on('close', () => {
            console.log('Connection to ROS bridge closed.');
        });

        // Subscribe to the /normal_zed topic.
        const normalSub = new ROSLIB.Topic({
            ros: ros,
            name: '/zed',
            messageType: 'std_msgs/String'
        });
        normalSub.subscribe((message) => {
            // The message.data field contains the base64 JPEG data.
            console.log(message)
            setNormalImage(`data:image/jpeg;base64,${message.data}`);
        });


        // Clean up subscriptions on unmount.
        return () => {
            normalSub.unsubscribe();
            ros.close();
        };
    }, []);

    return (
        <div className="p-5 m-auto grid place-content-center">
            <div className="m-auto rounded-md p-5 mb-[2rem] bg-[#222222]">
                <div className="flex justify-between items-center mb-4 ml-2">
                    <p className="text-white">Live Feed</p>
                    <div className={`h-3 w-3 rounded-full transition-all ${isLive ? 'bg-red-500' : 'bg-gray-500'}`} />
                </div>
                {normalImage &&
                    <img src={normalImage} alt="image" className='rounded-lg w-full max-w-5xl' width={200} height={200} />
                }

            </div>
        </div>
    );
};

export default Zed;
