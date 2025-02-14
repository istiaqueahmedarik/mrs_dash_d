'use client'
import React, { useState, useEffect, useRef } from 'react';

const Timer = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    const intervalRef = useRef(null);

    const startTimer = () => {
        if (isRunning) return;
        setIsRunning(true);
        setTimeLeft(1800);

        timerRef.current = setTimeout(() => {
            beep();
            setIsRunning(false);
            clearInterval(intervalRef.current);
        }, 1800000);

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const beep = () => {
        const context =
            new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, context.currentTime);
        oscillator.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 1);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <div className='container w-fit m-auto gap-5 grid grid-cols-2'>
            <button onClick={startTimer} className='bg-blue-500 hover:bg-blue-700 text-white mx-5 font-bold py-2 px-4 rounded'>
                {isRunning ? 'Running...' : 'Start'}
            </button>
            <div className='text-3xl font-bold'>
                {formatTime(timeLeft)}
            </div>  
        </div>
    );
};



export default Timer;