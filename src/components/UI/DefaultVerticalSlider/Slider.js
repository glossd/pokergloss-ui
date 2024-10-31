import Slider from "@material-ui/core/Slider";
import React from "react";

const DefaultVerticalSlider = ({value, setValue, max, min, className}) => {
  return (
    <Slider
      className={className}
      orientation="vertical"
      value={value}
      onChange={(event, newValue) => setValue(newValue)}
      min={min}
      max={max}
    />
  )
}

export default DefaultVerticalSlider
