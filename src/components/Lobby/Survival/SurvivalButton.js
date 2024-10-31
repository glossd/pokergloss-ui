import React from 'react'


const SurvivalButton = ({onClick, className, disabled, children}) => {
  return (
    <button
      onClick={onClick}
      className={`survival-button ${className ? className : ''}`}
      disabled={disabled}
    >
      <span className="survival-button-text">{children}</span>
    </button>
  )
}

export default SurvivalButton