"use client"
import React, { useEffect, useState, useRef } from 'react'
import Loader from './Loader'

function ArRow({id,dist,newTable,setNewTable,lat,lng}) {
    const [showLoader, setShowLoader] = useState(false);
    const [countdown, setCountdown] = useState(5);
   
    const intervalId = useRef(null);
    console.log("curr",lat,lng);
    

    useEffect(() => {

        

        if (dist < 200) {
            const timeout = setTimeout(() => {
                setShowLoader(true);
                intervalId.current = setInterval(() => {
                    if (dist > 200) {
                        clearInterval(intervalId.current);
                        setShowLoader(false);
                        setCountdown(5);
                    } else {
                        setCountdown(prevCountdown => {
                            if (prevCountdown === 1) {
                                clearInterval(intervalId.current);
                                setShowLoader(false);
                                setNewTable(prevTable => {
                                    const existingRow = prevTable.find(row => row.id === id);
                                    if (existingRow) {
                                        return prevTable;
                                    } else {
                                        return [...prevTable, {id, dist, lat,  lng, time: new Date().toLocaleTimeString()}];
                                    }
                                });
                                return 5;
                            } else {
                                return prevCountdown - 1;
                            }
                        });
                    }
                }, 1000);
            }, 2000);
            return () => {
                clearTimeout(timeout);
                if (intervalId.current) clearInterval(intervalId.current);
            };
        }
    }, [dist]);

    return (
        showLoader ? <Loader countdown={countdown} /> :  <tr key={id}>
        <td className="px-4 py-2">{id}</td>
        <td className="px-4 py-2">{dist}</td>
        </tr>
    )
}

export default ArRow
