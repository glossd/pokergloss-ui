import React from "react";
import Switch from '@material-ui/core/Switch';
import {FormControlLabel} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";

const PokerSwitch = withStyles({
  switchBase: {
    color: '#599ac1',
    '&$checked': {
      color: '#599ac1',
    },
    '&$checked + $track': {
      backgroundColor: '#5ab1e7',
    },
  },
  checked: {},
  track: {
    backgroundColor: 'gray'
  },
})(Switch);

const PokerFormControlLabel = withStyles({
  label: {
    lineHeight: 0
  },
  labelPlacementTop: {
    marginLeft: 0
  }
})(FormControlLabel)

const DefaultSwitch = ({checked, onChange, name, label, className}) => {
  return (
    <PokerFormControlLabel
      className={className}
      labelPlacement="top"
      control={
        <PokerSwitch
          checked={checked}
          onChange={onChange}
          name={name}/>
      }
      label={label}
    />
  )
}

export default DefaultSwitch