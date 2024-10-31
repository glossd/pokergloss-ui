import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
  },
  sizeStyle: {
    background: 'white',
    borderTopRightRadius: '16px',
    borderBottomRightRadius: '16px',
    paddingLeft: '10px',
    margin: '5px',
    color: 'black',
    width: '140px',
  },
  // menuItem: {
  //   color: 'black'
  // },
}));

export default function TableSizeSelect(props) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    props.setSize(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.sizeStyle}>
      <FormControl>
        <Select className={classes.menuItem}
          value={props.size}
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          onChange={handleChange}
        >
          <MenuItem value={6} type="number">6</MenuItem>
          <MenuItem value={9} type="number">9</MenuItem>

        </Select>
      </FormControl>
    </div>
  );
}