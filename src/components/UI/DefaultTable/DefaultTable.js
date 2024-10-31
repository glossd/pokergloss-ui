import React from "react";
import {Table, TableBody, TableContainer, TableHead} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import DefaultTableCell from "./DefaultTableCell";
import DefaultTableRow from "./DefaultTableRow";

const DefaultTable = ({headers, body, containerClassName, tableClassName}) => {
  return (
    <TableContainer className={containerClassName} component={Paper}>
      <Table className={tableClassName}>
        <TableHead>
          <DefaultTableRow>
            {headers.map(h => (<DefaultTableCell key={h}>{h}</DefaultTableCell>))}
          </DefaultTableRow>
        </TableHead>
        <TableBody>
          {body}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DefaultTable