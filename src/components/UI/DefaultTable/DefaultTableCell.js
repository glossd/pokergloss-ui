import React from "react";
import {TableCell} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";

const DefaultCell = withStyles(() => ({
  head: {
    backgroundColor: '#070f14',
    color: 'white',
    borderBottom: "none",
    fontFamily: 'Lobster, Georgia, Times, serif'
  },
  body: {
    color: 'white',
    borderBottom: "none",
  }
}))(TableCell);


const DefaultTableCell = ({children, align = "center", ...props}) => {

  return (
    <DefaultCell {...props} align={align}>
      {children}
    </DefaultCell>
  )
}

export default DefaultTableCell