import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {RestPostEmojiInputEmojiEnum} from "@pokergloss/table-chat-client-typescript";
import Joy from "./emojis/Joy";
import Cry from "./emojis/Cry";
import Like from "./emojis/Like";
import Rage from "./emojis/Rage";
import RaisedEyebrow from "./emojis/RaisedEyebrow";
import Scream from "./emojis/Scream";
import Sunglasses from "./emojis/Sunglasses";
import Wink from "./emojis/Wink";
import {subscribeBefore, unsubscribe} from "../../../../redux/redux-subscribe-action";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  defaultEmoji: {
    width: '140%',
    position: 'relative',
    right: '19%',
    bottom: '24%',
  },
  raisedEyebrow: {
    width: '140%',
    position: 'relative',
    right: '19%',
    bottom: '19%',
  },
  sunglasses: {
    width: '140%',
    position: 'relative',
    right: '19%',
    bottom: '20%',
  },
  rage: {
    width: '210%',
    position: 'relative',
    right: '54%',
    bottom: '9%',
  },
  scream: {
    width: '113%',
    position: 'relative',
    right: '7%',
    bottom: '7%',
  },
  like: {
    width: '100%',
    position: 'relative',
    left: '1%',
    bottom: '24%',
  }
}))

const EmojiPlate = React.memo(({position, playerUserId, isRight, height, width}) => {
  const classes = useStyles()

  const [emoji, setEmoji] = useState(null)

  useEffect(() => {
    subscribeBefore(`emoji-message-${position}`, (action) => {
      if (action.type === 'emojiMessage') {
        if (playerUserId === action.payload.user.userId) {
          setEmoji(action.payload.emoji)
          setTimeout(() => setEmoji(null), 3000)
        }
      }
    })
    return () => {
      unsubscribe(`emoji-message-${position}`)
    }
  }, [])

  function getEmoji() {
    switch (emoji){
      case RestPostEmojiInputEmojiEnum.Joy:
        return <Joy className={classes.defaultEmoji}/>
      case RestPostEmojiInputEmojiEnum.Cry:
        return <Cry className={classes.defaultEmoji}/>
      case RestPostEmojiInputEmojiEnum.Scream:
        return <Scream className={classes.scream}/>
      case RestPostEmojiInputEmojiEnum.Rage:
        return <Rage className={classes.rage}/>
      case RestPostEmojiInputEmojiEnum.Like:
        return <Like className={classes.like}/>
      case RestPostEmojiInputEmojiEnum.RaisedEyebrow:
        return <RaisedEyebrow className={classes.raisedEyebrow}/>
      case RestPostEmojiInputEmojiEnum.Sunglasses:
        return <Sunglasses className={classes.sunglasses}/>
      case RestPostEmojiInputEmojiEnum.Wink:
        return <Wink className={classes.defaultEmoji}/>
    }
  }

  const rootCSS = () => {
    let css = {height: `${height}vw`, width: `${height}vw`}
    if (!isRight) {
      css.left = `${width-height}vw`
    }
    return css
  }

  return (
    <div style={rootCSS()} className={classes.root}>
      {getEmoji()}
    </div>
  )
})

export default EmojiPlate