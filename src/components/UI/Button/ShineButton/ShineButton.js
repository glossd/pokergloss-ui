import React from 'react'


const ShineButton = ({onClick, className, disabled, children}) => {
  return (
    <button
      onClick={onClick}
      className={`shine-button ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default ShineButton