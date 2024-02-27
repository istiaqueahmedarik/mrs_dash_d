"use client"
import React from 'react'

function Loader({countdown}) {
  return (
    <div>
        <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading... {countdown}</span>
            </div>
        </div>
    </div>
  )
}

export default Loader