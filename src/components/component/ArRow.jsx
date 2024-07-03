"use client"
import React, { useEffect, useState, useRef } from 'react'
import Loader from './Loader'

function ArRow({id,dist,newTable,setNewTable,lat,lng}) {
    const [showLoader, setShowLoader] = useState(false);
    const [countdown, setCountdown] = useState(5);
   
    const intervalId = useRef(null);
    console.log("curr",lat,lng);
    

    useEffect(() => {
        // newTable.sort((a, b) => a.id - b.id);
        

        if (dist < 200) {
            const timeout = setTimeout(() => {
                const exist = newTable.find(row => row.id === id);
                if (!exist) { setShowLoader(true)  }
                intervalId.current = setInterval(() => {
                    if (dist > 200) {
                        clearInterval(intervalId.current);
                        setShowLoader(false);
                        setCountdown(2);
                    } else {
                        setCountdown(prevCountdown => {
                            if (prevCountdown === 1) {
                                clearInterval(intervalId.current);
                                setShowLoader(false);
                                setNewTable(prevTable => {
                                    const existingRow = prevTable.find(row => row.id === id);
                                    if (existingRow) {
                                        setShowLoader(false);
                                        return prevTable;
                                    } else {
                                        return [...prevTable, {id, dist, lat,  lng, time: new Date().toLocaleTimeString()}];
                                    }
                                });
                                return 2;
                            } else {
                                return prevCountdown - 1;
                            }
                        });
                    }
                }, 500);
            }, 1000);
            return () => {
                clearTimeout(timeout);
                if (intervalId.current) clearInterval(intervalId.current);
            };
        }
    }, [dist]);

    return (
        showLoader ? (
            <Loader countdown={countdown} />
        ) : (
            <tr key={id}>
                <td className="px-4 py-2">{id}</td>
                <td className="px-4 py-2">{dist}</td>
            </tr>
        )
    )
}

export default ArRow
