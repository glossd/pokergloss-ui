import React, {useState} from "react";
import {searchProfiles} from "../../backend/profile";
import {backendError} from "../../backend/error";
import {errorMessage} from "../../backend";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {avatarUrlOrDefault} from "../../auth";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import {chooseUser} from "../../redux/actions/messenger";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    height: '100%',
  },
  input: {
    position: "absolute",
    color: "white",
    width: "90%",
    borderRadius: "3%/30%",
    backgroundColor: "#182b37",
    padding: "1%",
    border: 'none',
    outline: 'none'
  },
  searchBox: {
    position: 'absolute',
    width: '90%',
    left: '5%',
    top: '62%',
    zIndex: 1,
    paddingTop: 0,
  },
  searchItem: {
    backgroundColor: "#183140",
    color: 'white',
    '&:hover': {
      background: "#47afe9",
    },
  },
  searchItemText: {
    marginLeft: "4%"
  }
}));

const SearchPeople = ({chooseUser}) => {
  const classes = useStyles()
  const { t } = useTranslation();

  const [userList, setUserList] = useState([]);
  const [searchError, setSearchError] = useState()

  function searchUserProfiles(username) {
    if (username) {
      searchProfiles(username)
        .then(profiles => {
          setUserList(profiles)
        })
        .catch(error => {
          backendError(error)
          setSearchError(errorMessage(error))
        })
    } else {
      setUserList([])
    }
  }

  const onUserItemClick = (user) => {
    setUserList([])
    chooseUser(user)
  }

  return (
    <div className={classes.root}>
      <input
        className={classes.input}
        name={"searchUsername"}
        autoComplete="off"
        placeholder={t("MessengerPage.Search people")}
        type={"text"}
        onChange={e => searchUserProfiles(e.target.value)}
      />
      <List className={classes.searchBox}>
        {userList.map((user, index) => (
          <ListItem className={classes.searchItem} button key={index} onClick={() => onUserItemClick(user)}>
            <Avatar src={avatarUrlOrDefault(user.picture)} alt="user-picture"/>
            <ListItemText className={classes.searchItemText} primary={user.username}/>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default connect(null, {chooseUser}) (SearchPeople)
