import React from 'react'


const DefaultButton = ({onClick, disabled, className, children}) => {
  return (
    <button
      onClick={onClick}
      className={`NotTransparentButton ${className ? className : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default DefaultButton