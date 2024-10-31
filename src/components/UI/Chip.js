import * as React from "react"

function Chip({id, width, height, sideColor, centerColor}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsosb="http://www.openswatchbook.org/uri/2009/osb"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      version="1.1"
      viewBox="0 0 20.3 17.7"
    >
      <defs>
        <linearGradient id={`linearGradient1023-${id}`}>
          <stop offset="0" style={{stopColor:centerColor, stopOpacity:"1"}}/>
          <stop offset="1" stopColor="#000" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`linearGradient1017-${id}`}>
          <stop offset="0" style={{stopColor:centerColor, stopOpacity:"1"}}/>
          <stop offset="1" stopColor="#000" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`linearGradient1005-${id}`}>
          <stop offset="0" style={{stopColor:sideColor, stopOpacity:"1"}}/>
          <stop offset="1" stopColor="#000" stopOpacity="1"/>
        </linearGradient>
        <linearGradient osbpaint="solid" id="linearGradient3559">
          <stop offset="0" stopColor="#000" stopOpacity="1"/>
        </linearGradient>
        <linearGradient osbpaint="solid" id={`linearGradient1589-${id}`}>
          <stop offset="0" style={{stopColor:sideColor, stopOpacity:"1"}}/>
        </linearGradient>
        <radialGradient
          id={`radialGradient1007-${id}`}
          cx="40.539"
          cy="68.611"
          r="37.852"
          fx="40.539"
          fy="68.611"
          gradientTransform="matrix(1.36072 -1.4556 1.48018 1.3837 -116.18 24.967)"
          gradientUnits="userSpaceOnUse"
          xlinkHref={`#linearGradient1005-${id}`}
        />
        <radialGradient
          id={`radialGradient1009-${id}`}
          cx="10.498"
          cy="15.738"
          r="1.839"
          fx="10.498"
          fy="15.738"
          gradientTransform="matrix(9.84564 -9.75926 9.28854 9.37078 -239.045 -29.01)"
          gradientUnits="userSpaceOnUse"
          xlinkHref={`#linearGradient1023-${id}`}
        />
        <radialGradient
          id={`radialGradient1011-${id}`}
          cx="10.498"
          cy="15.624"
          r="1.69"
          fx="10.498"
          fy="15.624"
          gradientTransform="matrix(10.71854 -10.6245 10.11208 10.20155 -260.016 -31.838)"
          gradientUnits="userSpaceOnUse"
          xlinkHref={`#linearGradient1017-${id}`}
        />
      </defs>
      <g
        strokeDasharray="none"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="4"
        strokeOpacity="1"
      >
        <path
          style={{fontVariationSettings: "normal"}}
          fill={`url(#radialGradient1007-${id})`}
          fillOpacity="1"
          fillRule="evenodd"
          stroke="#0a0505"
          strokeDashoffset="0"
          strokeWidth="0.378"
          d="M38.23 9.729c-16.366 0-30.289 7.806-35.484 18.709H.566v9.449c0 15.55 16.864 28.156 37.664 28.156 20.801 0 37.663-12.605 37.663-28.156v-9.45h-2.18C68.518 17.535 54.596 9.73 38.23 9.73z"
          opacity="1"
          stopColor="#000"
          stopOpacity="1"
          transform="scale(.26458)"
          vectorEffect="none"
        />
        <path
          style={{fontVariationSettings: "normal"}}
          fill={sideColor}
          fillOpacity="1"
          fillRule="evenodd"
          stroke="#0a0505"
          strokeDashoffset="0"
          strokeWidth="0.1"
          d="M10.115.074C4.612.074.15 3.41.15 7.524c0 4.115 4.462 7.45 9.965 7.45 5.504 0 9.965-3.335 9.965-7.45 0-4.114-4.461-7.45-9.965-7.45z"
          opacity="1"
          stopColor="#000"
          stopOpacity="1"
          vectorEffect="none"
        />
        <path
          fill="none"
          stroke="#000"
          strokeWidth="0.1"
          d="M.15 10.024v-2.5"
        />
        <path
          fill={centerColor}
          fillOpacity="1"
          stroke="#000"
          strokeWidth="0.05"
          d="M6.167 14.361l11.54-11.683C16.905 2.09 15.7 1.25 14.515.881L2.577 12.363c.809.76 2.61 1.71 3.59 1.998z"
        />
        <path
          fill="none"
          stroke="#000"
          strokeWidth="0.1"
          d="M20.08 10.024v-2.5"
        />
        <path
          fill={centerColor}
          stroke="#000"
          strokeWidth="0.05"
          d="M6.046.747l11.776 11.431c-.617.665-2.014 1.504-3.308 1.972L2.86 2.388c.765-.557 2.298-1.382 3.186-1.64z"
        />
        <path
          style={{fontVariationSettings: "normal"}}
          fill={centerColor}
          fillOpacity="1"
          fillRule="evenodd"
          stroke="#0a0505"
          strokeDashoffset="0"
          strokeWidth="0.2"
          d="M10.115 1.564c-4.403 0-7.972 2.669-7.972 5.96 0 3.292 3.57 5.96 7.972 5.96 4.403 0 7.972-2.668 7.972-5.96 0-3.291-3.57-5.96-7.972-5.96z"
          opacity="1"
          stopColor="#000"
          stopOpacity="1"
          vectorEffect="none"
        />
        <path
          fill={`url(#radialGradient1009-${id})`}
          fillOpacity="1"
          stroke="#000"
          strokeWidth="0.05"
          d="M6.167 14.361l.014 2.493c-1.238-.402-2.62-1.134-3.492-1.882l-.134-2.61c1.053.95 2.227 1.676 3.599 2.026"
        />
        <path
          fill={`url(#radialGradient1011-${id})`}
          fillOpacity="1"
          stroke="#000"
          strokeWidth="0.05"
          d="M17.805 12.221l.01 2.46c-.859.866-2.2 1.531-3.268 2.008l-.032-2.496c2.135-.838 2.521-1.267 3.29-1.972z"
        />
      </g>
    </svg>
  )
}

export default Chip
