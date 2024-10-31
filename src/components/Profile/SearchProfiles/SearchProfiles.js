import React, {useState} from "react";
import {searchProfiles} from "../../../backend/profile";
import FormControl from "@material-ui/core/FormControl";
import {Input} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {makeStyles} from "@material-ui/core/styles";
import {avatarUrlOrDefault} from "../../../auth";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";
import {setProfileUsername} from "../../../redux/actions/profile";
import {backendError} from "../../../backend/error";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: '2vw',
    textAlign: 'center',
    marginBottom: '1vw'
  },
  input: {
    color: 'white',
    fontSize: '2vw',
  },
  list: {
    backgroundColor: 'rgb(23 43 55)',
    position: 'relative',
    overflow: 'auto',
    maxHeight: '20vw',
  },
  userPicture: {
    width: '3vw',
    height: '3vw',
    borderRadius: '50%'
  },
  userName: {
    marginLeft: '1vw',
  },
  error: {
    color: 'red'
  }
}));

const SearchProfiles = ({setProfileUsername}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [searchUser, setSearchUser] = useState('');
  const [searchUsersList, setSearchUsersList] = useState([]);
  const [searchProfileError, setSearchProfileError] = useState('')

  function searchUserProfiles(username) {
    setSearchUser(username)
    if (username !== '') {
      searchProfiles(username)
        .then(profiles => {
          setSearchUsersList(profiles)
        })
        .catch(error => {
          backendError(error)
          setSearchProfileError('Something went wrong. Please try again later.')
        })
    } else {
      setSearchUsersList([])
    }
  }

  const chooseUserProfile = (username) => {
    setProfileUsername(username)
    setSearchUser('')
    setSearchUsersList([])
  }

  return (
    <div>
      <div className={classes.title}>{t("ProfilePage.SearchPlayers")}</div>
      <div className={classes.error}>{searchProfileError}</div>
      <FormControl>
        <Input
          className={classes.input}
          autoComplete={'off'}
          name={"searchUsername"}
          placeholder={t("ProfilePage.EnterUsernameHere")}
          type={"text"}
          value={searchUser}
          onChange={e => searchUserProfiles(e.target.value)}
        />
      </FormControl>
      <List className={classes.list}>
        {searchUsersList.map((user, index) => (
          <ListItem button key={index} onClick={() => chooseUserProfile(user.username)}>
            <img className={classes.userPicture} src={avatarUrlOrDefault(user.picture)} alt="user-picture"/>
            <ListItemText className={classes.userName} primary={user.username}/>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default connect(null, {setProfileUsername}) (SearchProfiles)