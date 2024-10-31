import React from "react";

const Club = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="0 0 100 100"
      {...props}
    >
      <defs>
        <linearGradient id="linearGradient861">
          <stop offset="0" stopColor="#000" stopOpacity="1"></stop>
          <stop offset="1" stopColor="gray" stopOpacity="1"></stop>
        </linearGradient>
        <radialGradient
          id="radialGradient863"
          cx="265.388"
          cy="301.23"
          r="249.574"
          fx="265.388"
          fy="301.23"
          gradientTransform="matrix(.4072 .2593 -.21969 .345 -7.482 -130.519)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#linearGradient861"
        ></radialGradient>
      </defs>
      <g>
        <path
          style={{ fontVariationSettings: "normal" }}
          fill="url(#radialGradient863)"
          fillOpacity="1"
          fillRule="evenodd"
          strokeDasharray="none"
          strokeDashoffset="0"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
          strokeOpacity="1"
          strokeWidth="0.178"
          d="M49.783.797a20.836 20.836 0 00-20.787 20.836 20.836 20.836 0 0017.742 20.605c2.09 3.177 2.103 8.43 2.927 12.871.8-4.647 1.15-10.558 2.806-12.808a20.836 20.836 0 0018.198-20.668A20.836 20.836 0 0049.832.797a20.836 20.836 0 00-.05 0zm-.118 54.312c1.236.218 2.16.696 2.917 1.312a20.836 20.836 0 00-.086 1.894A20.836 20.836 0 0073.332 79.15a20.836 20.836 0 0020.836-20.836 20.836 20.836 0 00-20.836-20.836 20.836 20.836 0 00-20.262 15.98c-.885.738-1.9 1.378-3.405 1.65zm0 0c-2.768 20.94-2.61 33.155-14.224 42.421h29.445c-12.448-9.682-12.542-21.873-15.221-42.42zm0 0c-1.107-.142-2.085-.583-2.961-1.26a20.836 20.836 0 00-20.371-16.457 20.836 20.836 0 00-.05 0A20.836 20.836 0 005.497 58.228a20.836 20.836 0 0020.836 20.837 20.836 20.836 0 0020.836-20.837 20.836 20.836 0 00-.065-1.649c.645-.58 1.47-1.081 2.56-1.47z"
          opacity="1"
          stopColor="#000"
          stopOpacity="1"
          vectorEffect="none"
        ></path>
      </g>
    </svg>
  )
}

export default Club
