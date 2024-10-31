import React from "react";

function Icon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="0 0 100 100"
      {...props}
    >
      <defs>
        <linearGradient id="linearGradient891">
          <stop offset="0" stopColor="#2e0036" stopOpacity="1"></stop>
          <stop offset="1" stopColor="#510081" stopOpacity="1"></stop>
        </linearGradient>
        <radialGradient
          id="radialGradient893"
          cx="503.764"
          cy="591.597"
          r="258.18"
          fx="503.764"
          fy="591.597"
          gradientTransform="matrix(.5503 .0306 -.00087 .2644 -226.546 -100.27)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#linearGradient891"
        ></radialGradient>
      </defs>
      <g>
        <path
          fill="url(#radialGradient893)"
          fillOpacity="1"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.041"
          d="M50.388 3.302L13.477 34.611c-9.825 10.6-9.847 27.69-.05 38.32 9.797 10.629 25.594 10.653 35.419.053l1.316-1.42 1.285 1.387c4.912 5.301 11.317 7.947 17.719 7.939 6.402-.009 12.8-2.67 17.7-7.984 9.8-10.627 9.781-27.718-.041-38.32zm-.226 68.262c-2.862 8.75-5.967 19.421-15.847 27.003h30.682c-8.946-7.235-12.872-18.01-14.835-27.003z"
        ></path>
      </g>
    </svg>
  );
}

export default Icon;