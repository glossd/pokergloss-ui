import DefaultCheckBox from "../UI/DefaultCheckBox/DefaultCheckBox";
import React, {useEffect} from "react";
import {getPlayerConfig, putAutoMuck, putAutoRebuy, putAutoTopUp} from "../../backend/table";
import {connect} from "react-redux";
import {useTranslation} from "next-i18next";
import {backendError} from "../../backend/error";
import IconButton from "@material-ui/core/IconButton";
import {Build} from "@material-ui/icons";
import Popover from "@material-ui/core/Popover";
import {newBoolAction, newObjectAction} from "../../redux/actions";
import {
  SET_AUTOCONFIG,
  SET_AUTOCONFIG_MUCK,
  SET_AUTOCONFIG_REBUY,
  SET_AUTOCONFIG_TOPUP
} from "../../redux/actions/table";
import {makeStyles} from "@material-ui/core/styles";
import {ModelTableTypeEnum} from "@pokergloss/table-client-typescript";

const useStyles = makeStyles(() => ({
  checkboxesRoot: {
    display: "flex",
    flexDirection: "column",
    color: "white",
    backgroundColor: "black",
  },
  checkbox: {
    marginLeft: '3px'
  },
  icon: {
    color: "white",
    '&:hover': {
      color: '#4d84a5',
    }
  }
}));

const PlayerConfig = ({tableId,  tableType, currentUserPosition, autoMuck, autoTopUp, autoRebuy, newBoolAction, newObjectAction, isAnonymous}) => {
  const { t } = useTranslation();
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (isAnonymous) {
      return
    }
    if (tableId && currentUserPosition >= 0) {
      getPlayerConfig(tableId, currentUserPosition)
        .then((config) => {
          newObjectAction(SET_AUTOCONFIG, config)
        })
        .catch(backendError);
    }
  }, [isAnonymous])

  const onMuckChange = (e) => {
    const checked = e.target.checked;
    putAutoMuck(tableId, currentUserPosition, checked)
      .then(() => newBoolAction(SET_AUTOCONFIG_MUCK, checked))
      .catch(backendError)
  }

  const onTopUpChange = (e) => {
    const checked = e.target.checked;
    putAutoTopUp(tableId, currentUserPosition, checked)
      .then(() => newBoolAction(SET_AUTOCONFIG_TOPUP, checked))
      .catch(backendError)
  }

  const onRebuyChange = (e) => {
    const checked = e.target.checked;
    putAutoRebuy(tableId, currentUserPosition, checked)
      .then(() => newBoolAction(SET_AUTOCONFIG_REBUY, checked))
      .catch(backendError)
  }

  if (currentUserPosition < 0) {
    return <div/>
  }

  const openConfig = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeConfig = () => {
    setAnchorEl(null);
  };

  const isTableCashType = () => {
    return tableType === ModelTableTypeEnum.CashGame
  }

  const open = Boolean(anchorEl);
  const id = open ? 'config-popover' : undefined;

  return (
    <div>
      <IconButton onClick={openConfig}>
        <Build className={classes.icon}/>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={closeConfig}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={classes.checkboxesRoot}>
          <DefaultCheckBox
            className={classes.checkbox}
            checked={autoMuck}
            onChange={onMuckChange}
            label={t("autoConfig.Muck")}
          />
          {
            isTableCashType() &&
              <>
                <DefaultCheckBox
                  className={classes.checkbox}
                  checked={autoTopUp}
                  onChange={onTopUpChange}
                  label={t("autoConfig.TopUp")}
                />
                <DefaultCheckBox
                  className={classes.checkbox}
                  checked={autoRebuy}
                  onChange={onRebuyChange}
                  label={t("autoConfig.Rebuy")}
                />
              </>
          }
        </div>
      </Popover>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS, auth } = state
  return {
    tableId: tableWS.table.id,
    tableType: tableWS.table.type,
    currentUserPosition: tableWS.currentUserPosition,
    autoMuck: tableWS.autoConfig.autoMuck,
    autoTopUp: tableWS.autoConfig.autoTopUp,
    autoRebuy: tableWS.autoConfig.autoRebuy,
    isAnonymous: auth.isAnonymous
  };
};

export default connect(mapStateToProps, {newBoolAction, newObjectAction})(PlayerConfig)