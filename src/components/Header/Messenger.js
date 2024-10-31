import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import {Sms} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import {backendError} from "../../backend/error";
import {getUnreadChatsCount} from "../../backend/messenger";
import {setUnreadCount} from "../../redux/actions/messenger";

const styles = makeStyles(() => ({
  icon: {
    '&:hover': {
      color: '#8ab8c9',
    },
  },
  messengerIcon: {
    color: "white",
    padding: "12px"
  },
}));

const Messenger = ({isAuthenticated, isAnonymous, unreadCount, setUnreadCount}) => {
  const classes = styles()
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isAnonymous) {
      if (unreadCount === null) {
        getUnreadChatsCount()
          .then(r => setUnreadCount(r.count))
          .catch(backendError)
      }
    }
  }, [isAuthenticated, isAnonymous])

  const goToMessenger = () => {
    router.push("/messenger")
  }

  return (
    <div>
      {isAuthenticated && !isAnonymous &&
      <IconButton className={classes.messengerIcon} onClick={goToMessenger}>
        <Badge badgeContent={unreadCount} color="secondary" invisible={!unreadCount}>
          <Sms className={classes.icon}/>
        </Badge>
      </IconButton>}
    </div>
  )
}

const mapStateToProps = state => {
  const {auth, messenger} = state
  return {
    isAuthenticated: auth.isAuthenticated,
    isAnonymous: auth.isAnonymous,
    unreadCount: messenger.unreadCount,
  };
};

export default connect(mapStateToProps, {setUnreadCount})(Messenger)