import React from "react";
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import {postEmoji} from "../../../backend/chat";
import {backendError} from "../../../backend/error";
import {RestPostEmojiInputEmojiEnum} from "@pokergloss/table-chat-client-typescript";
import {connect} from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const desktopStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    right: '1%',
    bottom: '39%'
  },
  emoji: {
    '&:hover': {
      background: '#346e80',
      cursor: 'pointer'
    },
    textAlign: 'center',
    fontSize: '4vh',
    padding: '1vh 1.3vh'
  },
  emojisContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '31vh',
    backgroundColor: '#06161f',
  },
}));

const mobileStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    right: '1%',
    bottom: '1%'
  },
  emoji: {
    '&:hover': {
      background: '#346e80'
    },
    textAlign: 'center',
    fontSize: '7vh',
    padding: '0.1vh 2vh'
  },
  emojisContainer: {
    backgroundColor: '#06161f',
  },
}));

const commonStyles = makeStyles(() => ({
  icon: {
    color: "white",
    '&:hover': {
      color: '#4d84a5',
    }
  },
}));

const EmojiActions = ({tableId, currentUserPosition}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)');
  const classes = isMobile ? mobileStyles() : desktopStyles()
  const commonClasses = commonStyles()

  const [anchorEl, setAnchorEl] = React.useState(null);

  const openConfig = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeConfig = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'emoji-popover' : undefined;

  function sendPlayerEmoji(emoji) {
    postEmoji(tableId, emoji)
      .then(() => {
        closeConfig()
      })
      .catch(backendError)
  }

  const emojis = [
    {
      name: RestPostEmojiInputEmojiEnum.Cry,
      icon: <>😥</>,
    },
    {
      name: RestPostEmojiInputEmojiEnum.Joy,
      icon: <>😂</>,
    },
    {
      name: RestPostEmojiInputEmojiEnum.Like,
      icon: <>👍</>,
    },
    {
      name: RestPostEmojiInputEmojiEnum.Rage,
      icon: <>😡</>,
    },
    {
      name: RestPostEmojiInputEmojiEnum.RaisedEyebrow,
      icon: <>🤨</>,
    },
    {
      name: RestPostEmojiInputEmojiEnum.Scream,
      icon: <>😱</>,
    },
    {
      name: RestPostEmojiInputEmojiEnum.Sunglasses,
      icon: <>😎</>,
    },
    {
      name: RestPostEmojiInputEmojiEnum.Wink,
      icon: <>😉</>,
    },
  ]

  if (currentUserPosition < 0) {
    return <div/>
  }

  return (
    <div>
      <IconButton  className={classes.root} onClick={openConfig}>
        <EmojiEmotionsIcon className={commonClasses.icon}/>
      </IconButton>
      <Popover
        id={id}
        className={'user-select-none'}
        open={open}
        anchorEl={anchorEl}
        onClose={closeConfig}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div className={classes.emojisContainer}>
          {
            emojis.map((emoji, index) => {
              return (
                <div className={classes.emoji} key={index}
                     onClick={() => sendPlayerEmoji(emoji.name)}>
                  {emoji.icon}
                </div>
              )
            })
          }
        </div>
      </Popover>
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    tableId: tableWS.table.id,
    currentUserPosition: tableWS.currentUserPosition,
  };
};

export default connect(mapStateToProps)(EmojiActions)