import React from "react";
import {animated, useSpring} from "react-spring";

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, 1.1]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

const MovingPicture = ({src}) => {

  const [logoProps, setLogoProps] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))

  return (
    <animated.div
      onMouseMove={({ clientX: x, clientY: y }) => setLogoProps({ xys: calc(x, y) })}
      onMouseLeave={() => setLogoProps({ xys: [0, 0, 1] })}
      style={{ transform: logoProps.xys.interpolate(trans) }}
    >
      <img style={{width: "100%"}} src={src} alt="" />
    </animated.div>
  )

}

export default MovingPicture