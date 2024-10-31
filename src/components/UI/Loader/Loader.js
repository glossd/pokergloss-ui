import React from 'react'


export default function Loader(){
  return (
    <div className='loader-default'>
      <div className="lds-ring-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}