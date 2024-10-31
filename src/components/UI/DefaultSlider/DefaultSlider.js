import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';


const useStyles = makeStyles({
  rootDefaultSlider: {
    width: '90%',
    padding: '2px',
    borderRadius: '5px',

  },
  inputDefaultSlider: {
    width: '60',
    color: 'black',
    backgroundColor: 'white',
    padding: '2px',
    borderRadius: '5px',
  },
});

export const MarkSlider = withStyles({
  root: {
    color: '#28b72a',
    height: 2,
    marginBottom: 0,
  },
  thumb: {
    height: 25,
    width: 25,
    backgroundColor: '#fff',
    marginTop: -12,
    marginLeft: -12,
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 12px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 14,
    width: 2,
    marginTop: -6,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
  markLabel: {
    top: "-15px",
    color: "white",
    opacity: "0.5"
  },
  markLabelActive: {
    opacity: "1"
  }
})(Slider);

export default function DefaultSlider({ value, setValue, max, min, marks, orientation}) {
  const classes = useStyles();

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleLimits = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };

  return (
    <div className={classes.rootDefaultSlider}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Input
            className={classes.inputDefaultSlider}
            type='number'
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleLimits}
            autoFocus={false}
            disableUnderline={true}
            inputProps={{
              max: max,
              min: min,
              value: value,
              type: 'number',
            }}
          />
        </Grid>
        <Grid item xs>
          <MarkSlider value={value}
                  onChange={handleSliderChange}
                  aria-labelledby="input-slider"
                  min={min}
                  max={max}
                  marks={marks}
                  orientation={orientation}
          />
        </Grid>

      </Grid>
    </div>
  );
}
