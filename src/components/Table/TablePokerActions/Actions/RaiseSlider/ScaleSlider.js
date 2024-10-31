import React from "react";
import Slider from "@material-ui/core/Slider";

function log2(x) {
  return Math.log(x) / Math.log(2);
}

function pow2(x) {
  return Math.ceil(Math.pow(2, x));
}

export default function ScaleSlider({min, max, value, setValue}) {
  const handleChange = (e, newValue) => {
    setValue(pow2(newValue));
  };
  return (
    <div>
      <Slider
        value={log2(value)}
        min={log2(min)}
        step={0.1}
        max={log2(max)}
        scale={x => pow2(x)}
        onChange={handleChange}
      />
    </div>
  );
}
