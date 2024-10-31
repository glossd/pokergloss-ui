import React, {memo, useEffect, useRef} from "react";
import Lottie from "lottie-web";

// Got it from https://codepen.io/dilums/pen/XWdqvGd
const DefaultLottie = memo(({className, path}) => {
  const elm = useRef();
  const animation = useRef();

  useEffect(() => {
    animation.current = Lottie.loadAnimation({
      path,
      container: elm.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
    })
  }, []);

  return <div className={className} ref={elm} />;
});

export default DefaultLottie