import React from "react";


const TextShadow = ({children, className, style}) => {

  return (
    <div style={style} className={`text-shadow ${className}`}>
      {children}
    </div>
  )
}

export default TextShadow