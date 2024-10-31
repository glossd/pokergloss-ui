import {makeStyles} from "@material-ui/core/styles";
import {Avatar} from "@material-ui/core";
import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useRouter} from "next/router";
import IconButton from "@material-ui/core/IconButton";
import {ArrowBack} from "@material-ui/icons";
import {nullifyChosenOne} from "../../redux/actions/messenger";
import {connect} from "react-redux";
import {setProfileUsername} from "../../redux/actions/profile";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: 'white',
    display: 'flex',
    alignItems: 'center'
  },
  backBtn: {
    color: "white",
  },
  headerChat: {
    padding: '0 2% 0 1.5%',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: "#195c86"
    },
  },
  headerChatPicture: {
    color: "#092435",
    backgroundColor: "#134869"
  },
  headerChatName: {
    paddingLeft: '6%',
  },
}))

const ChatHeader = ({picture, name, nullifyChosenOne, setProfileUsername}) => {
  const classes = useStyles()
  const isMobile = useMediaQuery('(max-device-width: 1224px)');
  const router = useRouter();

  const handleOpenProfile = () => {
    setProfileUsername(name)
    router.push(`/u/${name}`)
  }

  return (
    <div className={classes.root}>
      {
        isMobile &&
        <IconButton className={classes.backBtn} onClick={() => nullifyChosenOne()}>
          <ArrowBack/>
        </IconButton>
      }
      <div className={classes.headerChat} onClick={handleOpenProfile}>
        <Avatar className={classes.headerChatPicture} src={picture}>{name.substring(0, 1)}</Avatar>
        <div className={classes.headerChatName}>{name}</div>
      </div>
    </div>
  )
}

export default connect(undefined, {nullifyChosenOne, setProfileUsername}) (ChatHeader)

