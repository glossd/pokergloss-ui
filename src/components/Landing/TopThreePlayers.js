import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {connect} from "react-redux";
import {setProfileUsername} from "../../redux/actions/profile";
import {useRouter} from "next/router";

const portraitStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25vw",
  },
  plate: {
    position: "relative",
    width: "25vw",
    height: "25vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    '&:hover': {
      filter: "brightness(1.25)",
      cursor: "pointer",
    },
  },
  picture: {
    width: "100%",
    height: "100%",
    border: "solid 1.2vw transparent",
    borderRadius: "50%",
    backgroundOrigin: "border-box",
    backgroundClip: "content-box, border-box",
    zIndex: 2,
  },
  banner: {
    position: "absolute",
    top: "75%",
    minWidth: "75%",
    width: "fit-content",
    background: "radial-gradient(circle at top left, #00f3ff, #2a219a)",
    color: "white",
    padding: "25% 3% 15% 3%",
    fontWeight: "bold",
    zIndex: 1,
    '&:after': {
      position: "absolute",
      bottom: "10vw",
      content: "''",
      margin: "-10vw",
      width: 0,
      height: 0,
      borderLeft: "10vw solid transparent",
      borderRight: "10vw solid transparent",
      borderBottom: "3vw solid #000000",
    }
  },
  rank: {
    position: "absolute",
    top: "2%",
    left: "2%",
    width: "30%",
    height: "30%",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top left, #00f3ff, #2a219a)",
    color: "white",
    fontWeight: "bold",
    zIndex: 3,
  }
}))

const landscapeStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "8vw",
  },
  plate: {
    position: "relative",
    width: "20vw",
    height: "20vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    '&:hover': {
      filter: "brightness(1.25)",
      cursor: "pointer",
    },
  },
  picture: {
    width: "80%",
    height: "80%",
    border: "solid 1.2vw transparent",
    borderRadius: "50%",
    backgroundOrigin: "border-box",
    backgroundClip: "content-box, border-box",
    zIndex: 2,
  },
  banner: {
    position: "absolute",
    top: "65%",
    minWidth: "60%",
    width: "fit-content",
    background: "radial-gradient(circle at top left, #00f3ff, #2a219a)",
    color: "white",
    padding: "25% 3% 15% 3%",
    fontSize: "1.5vw",
    zIndex: 1,
    '&:after': {
      position: "absolute",
      bottom: "6vw",
      content: "''",
      margin: "-6vw",
      width: 0,
      height: 0,
      borderLeft: "6vw solid transparent",
      borderRight: "6vw solid transparent",
      borderBottom: "3vw solid #000000",
    }
  },
  rank: {
    position: "absolute",
    top: "15%",
    left: "15%",
    width: "15%",
    height: "15%",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top left, #00f3ff, #2a219a)",
    color: "white",
    fontWeight: "bold",
    fontSize: "2vw",
    zIndex: 3,
  }
}))

const TopThreePlayers = ({ratings}) => {
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isPortrait ? portraitStyles() : landscapeStyles()
  const router = useRouter();

  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (ratings && ratings.length > 2) {
      setPlayers([ratings[1], ratings[0], ratings[2]]);
    }
  }, [])

  function playerPictureStyle(rank) {
    let result = "linear-gradient(white, white), "
    let gradient

    switch (rank) {
      case 1: {
        gradient = "linear-gradient(115deg, rgb(255 213 30), rgb(246, 205, 53), rgb(239 171 33), rgb(109 82 25)"
        break
      }
      case 2: {
        gradient = "linear-gradient(115deg, rgb(255 255 255), rgb(121 121 116), rgb(107 105 100), rgb(14 14 14)"
        break
      }
      case 3: {
        gradient = "linear-gradient(115deg, rgb(230 182 126), rgb(195 117 48), rgb(144 82 27), rgb(33 13 3)"
        break
      }
      default: {
        gradient = "radial-gradient(circle at top left, #f00,#3020ff)"
      }
    }
    return { backgroundImage: result + gradient }
  }

  function playerRootStyle(rank) {
    let marginTop
    switch (rank) {
      case 2: {
        marginTop = 20
        break
      }
      case 3: {
        marginTop = 35
        break
      }
      case 1:
      default: {
        marginTop = 0
      }
    }
    return { marginTop: marginTop }
  }

  function openUserProfile(username) {
    setProfileUsername(username)
    router.push(`/u/${username}`)
  }

  if (!players) {
    return <div/>
  }

  return (
    <div className={classes.root}>
      {
        players.map(player => {
          return (
            <div
              key={player.userId}
              className={classes.plate}
              style={playerRootStyle(player.rank)}
              onClick={() => openUserProfile(player.username)}
            >
              <img src={player.picture} className={classes.picture} style={playerPictureStyle(player.rank)} alt=""/>
              <div className={classes.banner}>
                <div>{player.username}</div>
                <div>{player.chips}</div>
              </div>
              <div className={classes.rank}>
                {player.rank}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ratings: state.landing.ratings
  }
}

export default connect(mapStateToProps, {setProfileUsername})(TopThreePlayers)
