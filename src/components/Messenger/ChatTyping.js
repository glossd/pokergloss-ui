import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(() => ({
  root: {
    color: "#b1a8a8"
  }
}))

const ChatTyping = ({typing, chosenChat}) => {
  const classes = useStyles()
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now())
    }, 500);

    return () => {
      clearInterval(id)
    }
  }, [])

  if (!typing || !chosenChat || chosenChat.id !== typing.chatId) {
    return <div/>
  }
  if (now - 1000 > typing.timeAt) {
    return <div/>
  }
  return (
    <div className={`${classes.root} three-dots-animation`}>
      {typing.user.username} {t("MessengerPage.typing")}
    </div>
  )
}

const mapStateToProps = state => {
  const { messenger } = state
  return {typing: messenger.typing, chosenChat: messenger.chosenChat};
};

export default connect(mapStateToProps) (ChatTyping)
