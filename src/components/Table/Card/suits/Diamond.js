import React from "react";

const Diamond = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="0 0 100 100"
      {...props}
    >
      <defs>
        <linearGradient id="linearGradient841">
          <stop offset="0" stopColor="red" stopOpacity="1"></stop>
          <stop offset="1" stopColor="#ff6400" stopOpacity="1"></stop>
        </linearGradient>
        <radialGradient
          id="radialGradient843"
          cx="191.106"
          cy="38.035"
          r="50"
          fx="191.106"
          fy="38.035"
          gradientTransform="matrix(.5572 -.4137 1.0844 1.46108 -97.636 73.297)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#linearGradient841"
        ></radialGradient>
      </defs>
      <g>
        <path
          fill="url(#radialGradient843)"
          fillOpacity="1"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.036"
          d="M49.515 1.137l40.479 48.889-40.48 49.636L9.598 50.026z"
        ></path>
      </g>
    </svg>
  )
}

export default Diamond
