import React, {useEffect} from "react";
import {connect} from "react-redux";
import {setTableUsersListContent} from "../../../redux/actions/tableUserList";
import {tableUsers} from "../../../backend/table-stream";
import {Badge, IconButton, Popover} from "@material-ui/core";

import {avatarUrlOrDefault, defaultAvatarUrl} from "../../../auth";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {backendError} from "../../../backend/error";

const useStyles = makeStyles(() => ({
  userListButton: {
    padding: '5px',
  },
  popover: {
    pointerEvents: 'none',
  },
}));

const TableUserList = ({tableId, content, setTableUsersListContent}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-device-width: 1224px)');
  const users = [...content.users.values()]

  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    tableUsers(tableId)
      .then((res) => {
        setTableUsersListContent(res)
      })
      .catch(backendError)
  }, [])

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const openUserList = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeUserList = () => {
    setAnchorEl(null);
  };

  const anonymousUsers = () => {
    const anonymousUsers = []
    for (let i = 0; i < content.anonymousCount; i++) {
      anonymousUsers.push({
        userId: "anonym-" + i,
        username: "Anonym",
        picture: defaultAvatarUrl
      })
    }
    return anonymousUsers
  }

  return (
    <div>
      {!isMobile &&
      <div>
        <IconButton
          aria-describedby={id}
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          className={classes.userListButton}
          onMouseOver={openUserList}
          onMouseLeave={closeUserList}
        >
          <Badge badgeContent={users.length + content.anonymousCount} color="primary">
            <img className='binoculars-icon'
                 src="https://storage.googleapis.com/pokerblow/poker-table/binoculars-white.svg" alt="binoculars-icon"/>
          </Badge>
        </IconButton>
        <Popover
          id={id}
          className={classes.popover}
          open={open}
          anchorEl={anchorEl}
          onClose={closeUserList}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className='table-user-list-popover'>
            {content &&
            users.concat(anonymousUsers()).map(user => {
              return (
                <div className='table-user-list-popover-cell' key={user.userId}>
                  <img className='table-user-list-popover-avatar' src={avatarUrlOrDefault(user.picture)}
                       alt="user-picture"/>
                  <div className='table-user-list-popover-username'>
                    {user.username}
                  </div>
                </div>
              )
            })
            }
          </div>
        </Popover>
      </div>
      }
    </div>
  )
}

const mapStateToProps = state => {
  const {tableUsersList} = state
  return {content: tableUsersList};
};

export default connect(mapStateToProps, {setTableUsersListContent})(TableUserList)