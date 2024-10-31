import React from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";

const DefaultRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#0a161e',
      '&:hover': {
        backgroundColor: '#315c76',
      },
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#070f14',
      '&:hover': {
        backgroundColor: '#315c76',
      },
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  cursorStyle: {
    '&:hover': {
      cursor: 'pointer'
    },
  },
  style: {
    '&:nth-of-type(odd)': {
      backgroundColor: props => props.odd,
    },
    '&:nth-of-type(even)': {
      backgroundColor: props => props.even,
    },
  },
  selectedStyle: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#4D84A5',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#4D84A5',
    },
  },
});

const DefaultTableRow = ({children, isCursorPointer = false, isSelected = false, ...props}) => {
  const {style, cursorStyle, selectedStyle} = useStyles(props)
  return (
    <DefaultRow {...props} className={`${style} ${isCursorPointer && cursorStyle} 
    ${isSelected && selectedStyle}`}>
      {children}
    </DefaultRow>
  )
}

export default DefaultTableRow