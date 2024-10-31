import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

const DefaultCheckBox = ({checked, onChange, name, label, className}) => {
  return (
    <FormControlLabel
      className={className}
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          name={name}
        />
      }
      label={label}
    />
  )
}

export default DefaultCheckBox