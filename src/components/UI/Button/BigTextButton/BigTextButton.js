import React from 'react'


const BigTextButton = ({onClick, className, disabled, children}) => {
  return (
    <button
            onClick={onClick}
            className={`ButtonPoker ${className}`}
            disabled={disabled}
    >
      {children}
    </button>
  )
}

export default BigTextButton