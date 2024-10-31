import React from "react";

const Heart = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="0 0 100 100"
      {...props}
    >
      <defs>
        <linearGradient id="linearGradient844">
          <stop offset="0" stopColor="#ff3f00" stopOpacity="1"></stop>
          <stop offset="1" stopColor="#a70000" stopOpacity="1"></stop>
        </linearGradient>
        <radialGradient
          id="radialGradient846"
          cx="933.938"
          cy="585.682"
          r="258.18"
          fx="933.938"
          fy="585.682"
          gradientTransform="matrix(.00086 .14741 -.59696 .0042 399.28 -122.024)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#linearGradient844"
        ></radialGradient>
      </defs>
      <g>
        <path
          fill="url(#radialGradient846)"
          fillOpacity="1"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.044"
          d="M29.983 7.996c-6.9.003-13.797 2.879-19.081 8.625C.334 28.113.342 46.607 10.92 58.089l39.246 33.884 39.8-33.85c10.596-11.463 10.632-29.958.08-41.468-10.55-11.511-27.574-11.55-38.17-.087l-1.42 1.535-1.384-1.502c-5.289-5.74-12.19-8.609-19.089-8.605z"
        ></path>
      </g>
    </svg>
  )
}

export default Heart
