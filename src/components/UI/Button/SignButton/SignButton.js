import React from 'react'


const SignButton = props => {
  return (
    <button
      onClick={props.onClick}
      className='SignButton'
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}

export default SignButton