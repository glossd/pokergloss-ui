import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableContainer} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {avatarUrlOrDefault} from "../../auth";
import {makeStyles} from "@material-ui/core/styles";
import ChipIcon from "../UI/ChipIcon";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import {setProfileUsername} from "../../redux/actions/profile";

const useStyles = makeStyles(() => ({
  root1: {
    display: "flex",
    justifyContent: "center"
  },
  root: {
    maxWidth: 600,
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: "#285ab5",
      '&:hover': {
        filter: "brightness(1.25)",
        cursor: "pointer"
      },
    },
    '&:nth-of-type(even)': {
      backgroundColor: "black",
      '&:hover': {
        filter: "brightness(1.5)",
        cursor: "pointer"
      },
    },
    '& > td': {
      color: "white",
      borderBottom: "none",
    }
  },
  picture: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    marginRight: 15
  },
  redChip: {
    width: 20,
    height: 20,
    marginRight: 3,
  }
}));

const TopPlayersTable = ({ratings, setProfileUsername}) => {
  const classes = useStyles();
  const router = useRouter();
  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (ratings && ratings.length > 9) {
      setPlayers(ratings.slice(3, 10))
    }
  }, [])

  function openUserProfile(username) {
    setProfileUsername(username)
    router.push(`/u/${username}`)
  }

  if (!players) {
    return <div/>
  }

  return (
    <div className={classes.root1}>
      <TableContainer className={classes.root} component={Paper}>
        <Table size="small">
          <TableBody>
            {
              players.map((player) => (
                <TableRow key={player.userId} className={classes.tableRow} onClick={() => openUserProfile(player.username)}>

                  <TableCell align="left">
                    {player.rank}
                  </TableCell>

                  <TableCell align="left">
                    <img className={classes.picture} src={avatarUrlOrDefault(player.picture)} alt=""/>
                    {player.username}
                  </TableCell>

                  <TableCell align="right">
                    <ChipIcon className={classes.redChip}/>
                    {player.chips}
                  </TableCell>

                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ratings: state.landing.ratings
  }
}

export default connect(mapStateToProps, {setProfileUsername})(TopPlayersTable)