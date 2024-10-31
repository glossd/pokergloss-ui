import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';

import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter} from "next/router";
import {postSitNGoRoom, postTable} from "../../../backend/table";
import {useTranslation} from "next-i18next";
import DefaultButton from "../../UI/Button/DefaultButton/DefaultButton";
import {backendError} from "../../../backend/error";
import DefaultCheckBox from "../../UI/DefaultCheckBox/DefaultCheckBox";
import {MenuItem, Select} from "@material-ui/core";
import {ModelTableBettingLimitEnum} from "@pokergloss/table-client-typescript/dist/api";
import InputAdornment from "@material-ui/core/InputAdornment";
import moment from "moment";

const useStyles = makeStyles(() => ({
  labelAndInput: {
    background: '#182b37',
    marginBottom: '3px',
    width: '350px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  labelAndInputNoColor: {
    marginBottom: '3px',
    width: '350px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  label: {
    width: '80%',
    textAlign: 'center',
    fontWeight: 'lighter',
    paddingTop: '8px',
  },
  input: {
    background: 'white',
    paddingLeft: '10px',
    margin: '7px',
    color: 'black',
    width: '180px',
  },
  select: {
    background: 'white',
    paddingLeft: '10px',
    margin: '7px 8px 7px 7px',
    color: 'black',
    width: '315px',
  },
  openDialogButton: {
    padding: '15px',
  }
}))

function CreateTable({lobbyType}) {

  const { t } = useTranslation();
  const classes = useStyles()
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  // https://www.metoffice.gov.uk/weather/learn-about/weather/types-of-weather/wind/wind-names#Berg
  let arrayTableNames = ['Berg', 'Bora', 'Chinook', 'Etesian', 'Foehn', 'Haboob', 'Harmattan',
                        'Khamsin', 'Levant', 'Leveche', 'Mistral', 'Scirocco']

  const [name, setName] = useState("")
  const [isNameError, setIsNameError] = useState(false)

  const handleClickOpen = () => {
    let randomTableNameFromArray = arrayTableNames[Math.floor(Math.random() * arrayTableNames.length)]
    setName(randomTableNameFromArray)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [size, setSize] = useState(6);
  const [isSizeError, setIsSizeError] = useState(false)

  const [bigBlind, setBigBlind] = useState(2);
  const [bigBlindErrorText, setBigBlindErrorText] = useState("")

  const [decisionTimeoutSec, setDecisionTimeoutSec] = useState(10)
  const [isDecisionTimeoutSecError, setIsDecisionTimeoutSecError] = useState(false)

  const [bettingLimit, setBettingLimit] = useState(ModelTableBettingLimitEnum.NL)
  const bettingLimits = [ModelTableBettingLimitEnum.NL, ModelTableBettingLimitEnum.PL,
    ModelTableBettingLimitEnum.FL, ModelTableBettingLimitEnum.ML]

  const [isPrivate, setIsPrivate] = useState(false)

  const getPlacesPaid = () => Math.max(1, Math.floor(size / 3))

  const [buyIn, setBuyIn] = useState(100)
  const [buyInErrorText, setBuyInErrorText] = useState('')

  const [levelIncreaseTimeMinutes, setLevelIncreaseTimeMinutes] = useState(5)
  const [isLevelIncreaseError, setIsLevelIncreaseError] = useState(false)

  const [placesPaid, setPlacesPaid] = useState( 1)
  const [isPlacesPaidError, setIsPlacesPaidError] = useState(false)

  const [startsIn, setStartsIn] = useState()
  const [startsInError, setStartsInError] = useState("")

  // https://stackoverflow.com/questions/43067719/how-to-allow-only-numbers-in-textbox-in-reactjs
  function isNumberValue(e) {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      return true
    }
  }

  function onChangeBuyIn(e) {
    if (isNumberValue(e)) {
      const buyIn = Number(e.target.value)
      setBuyIn(buyIn)
      if (buyIn < 100) {
        setBuyInErrorText("> 99")
      } else if (buyIn < 5*bigBlind) {
        setBuyInErrorText("5*BB < Buy-In")
      } else if (buyIn > 500*bigBlind) {
        setBuyInErrorText("500*BB < Buy-In")
      } else if (!!buyInErrorText) {
        setBuyInErrorText('')
      }
    }
  }

  function onChangeLevelIncrease(e) {
    if (isNumberValue(e)) {
      const levelIncreaseTimeMinutes = Number(e.target.value)
      setLevelIncreaseTimeMinutes(levelIncreaseTimeMinutes)
      if (levelIncreaseTimeMinutes < 1 || levelIncreaseTimeMinutes > 60 ) {
        setIsLevelIncreaseError(true)
      } else if (isLevelIncreaseError) {
        setIsLevelIncreaseError(false)
      }
    }
  }

  function onChangePlacesPaid(e) {
    if (isNumberValue(e)) {
      const placesPaid = Number(e.target.value)
      setPlacesPaid(placesPaid)
      if (placesPaid < 1 || placesPaid > getPlacesPaid()) {
        setIsPlacesPaidError(true)
      } else if (isPlacesPaidError) {
        setIsPlacesPaidError(false)
      }
    }
  }

  function onChangeName(e) {
    const name = e.target.value
    setName(name)
    if (name.length < 3 || name.length > 13) {
      setIsNameError(true)
    } else if (isNameError) {
      setIsNameError(false)
    }
  }

  function onChangeSize(e) {
    if (isNumberValue(e)) {
      const size = Number(e.target.value)
      setSize(size)
      if (size < 2 || size > 20) {
        setIsSizeError(true)
      } else if (isSizeError) {
        setIsSizeError(false)
      }
    }
  }

  function onChangeBigBlind(e) {
    if (isNumberValue(e)) {
      const bigBlind = Number(e.target.value)
      setBigBlind(bigBlind)
      if (bigBlind < 2) {
        setBigBlindErrorText('must be more than 1')
      } else if (bigBlindErrorText) {
        setBigBlindErrorText("")
      }
    }
  }

  function onChangeSitngoBigBlind(e) {
    if (isNumberValue(e)) {
      const bigBlind = Number(e.target.value)
      setBigBlind(bigBlind)
      if (bigBlind < 2) {
        setBigBlindErrorText("must be more than 1")
      } else if (buyIn < 5*bigBlind) {
        setBigBlindErrorText("5*BB < Buy-In")
      } else if (buyIn > 500*bigBlind) {
        setBigBlindErrorText("500*BB < Buy-In")
      } else if (bigBlindErrorText) {
        setBigBlindErrorText("")
      }
    }
  }

  function onChangeDecisionTimeoutSec(e) {
    if (isNumberValue(e)) {
      const decisionTimeoutSec = Number(e.target.value)
      setDecisionTimeoutSec(decisionTimeoutSec)
      if (decisionTimeoutSec < 3 || decisionTimeoutSec > 60) {
        setIsDecisionTimeoutSecError(true)
      } else if (isDecisionTimeoutSecError) {
        setIsDecisionTimeoutSecError(false)
      }
    }
  }

  function onChangeStartsIn(e) {
    const startTime = (moment(e.target.value, "HH:mm").valueOf())
    const currentTime = Date.now()
    const minutesLeft = Math.floor((startTime - currentTime) / (1000 * 60))

    if (minutesLeft > 0 && minutesLeft < 31) {
      setStartsIn(minutesLeft)
    }

    if (minutesLeft > 30) {
      setStartsInError("< 30")
    } else if (minutesLeft < 1) {
      setStartsInError("> 0")
    } else if (!!startsInError) {
      setStartsInError("")
    }
  }
  function getStartAt() {
    if (!startsIn) {
      return 0
    }
    let d = new Date();
    d.setSeconds(0, 0)
    d.setMinutes(d.getMinutes()+1)
    return d.getTime() + startsIn*60*1000
  }

  function onChangeBettingLimit(e) {
    setBettingLimit(e.target.value)
  }

  function containsErrors() {
    switch (lobbyType) {
      case "sitngo":
        return tableContainersError() || !!buyInErrorText || isLevelIncreaseError || isPlacesPaidError || !!startsInError
      case "ring":
      default:
        return tableContainersError()
    }
  }

  function tableContainersError() {
    return isNameError || isSizeError || !!bigBlindErrorText || isDecisionTimeoutSecError
  }

  const getTableData = () => ({name, size, bigBlind, decisionTimeoutSec, isPrivate, bettingLimit})
  const getSitNGoRoomData = () => ({buyIn, levelIncreaseTimeMinutes, placesPaid, isPrivate, bettingLimit, startAt: getStartAt()})

  function createTableAndCloseDialog() {
    switch (lobbyType) {
      case "sitngo": {
        postSitNGoRoom(Object.assign(getSitNGoRoomData(), {tableParams: getTableData()}))
          .then(data => {
            handleClose()
            router.push('/lobby/sitngo/' + data.id)
          })
          .catch(backendError)
        break
      }
      case "ring":
      default:
        postTable(getTableData())
          .then(data => {
            handleClose()
            router.push('/tables/' + data.id)
          })
          .catch(backendError)
        break
    }
  }

  const getRingInputs = () => {
    return [
      {
        label: t("lobby.Create table.name"),
        value: name,
        onChange: onChangeName,
        isError: isNameError,
        errorText: 'must be between 3 and 13'
      },
      {
        label: t("lobby.Create table.size"),
        value: size,
        onChange: onChangeSize,
        isError: isSizeError,
        errorText: 'must be between 2 and 20'
      },
      {
        label:  t("lobby.Create table.decision (sec)"),
        value: decisionTimeoutSec,
        onChange: onChangeDecisionTimeoutSec,
        isError: isDecisionTimeoutSecError,
        errorText: 'must be between 3 and 60',
        endAdornment: <InputAdornment position="end">({t("sec")})</InputAdornment>
      },
      {
        key: "bigBlind",
        label:  t("lobby.Create table.big blind"),
        value: bigBlind,
        onChange: onChangeBigBlind,
        isError: !!bigBlindErrorText,
        errorText: bigBlindErrorText
      },
    ]
  }

  const getSitNGoInputs = () => {
    return getRingInputs().filter(i => i.key !== "bigBlind").concat([
      {
        key: "bigBlind",
        label:  t("lobby.Create table.big blind"),
        value: bigBlind,
        onChange: onChangeSitngoBigBlind,
        isError: !!bigBlindErrorText,
        errorText: bigBlindErrorText,
      },
      {
        label: t("lobby.Create table.buy in"),
        value: buyIn,
        onChange: onChangeBuyIn,
        isError: !!buyInErrorText,
        errorText: buyInErrorText
      },
      {
        label: t("lobby.Create table.blind increase (min)"),
        value: levelIncreaseTimeMinutes,
        onChange: onChangeLevelIncrease,
        isError: isLevelIncreaseError,
        errorText: 'must be between 1 and 60',
        endAdornment: <InputAdornment position="end">({t("min")})</InputAdornment>
      },
      {
        label: t("lobby.Create table.places paid"),
        value: placesPaid,
        onChange: onChangePlacesPaid,
        isError: isPlacesPaidError,
        errorText: 'must be between 1 and ' + getPlacesPaid()
      }
    ])
  }

  const getInputs = () => {
    switch (lobbyType) {
      case "sitngo":
        return getSitNGoInputs()
      case "ring":
      default:
        return getRingInputs()
    }
  }

  const createButtonText = lobbyType === 'sitngo' ? t("lobby.Create table.Create Sit & Go") : t("lobby.Create table.Create table")

  return (
    <div className='root'>
      <DefaultButton onClick={handleClickOpen} className={classes.openDialogButton}>{createButtonText}</DefaultButton>

      <DefaultDialog
        open={open}
        onClose={handleClose}
        title={createButtonText}
        action={{text: createButtonText, onClick: createTableAndCloseDialog, disabled: containsErrors()}}
        cancel={{text: t("lobby.Create table.Cancel"), onClick: handleClose}}
      >
        <div>
          {getInputs().map(input => (
            <div key={input.label} className={`selector ${classes.labelAndInput}`}>
              <label className={classes.label}>{input.label}:</label>
              <TextField
                InputProps={{
                  className: classes.input,
                  endAdornment: input.endAdornment
                }}
                value={input.value}
                onChange={input.onChange}
                name='name'
                type="text"
                error={input.isError}
                helperText={input.isError && input.errorText}
              />
            </div>
          ))}
          {
            lobbyType === "sitngo" && (
              <div className={`selector ${classes.labelAndInput}`}>
                <label className={classes.label}>{t("lobby.Create table.StartsIn")}:</label>
                <TextField
                  InputProps={{
                    className: classes.input,
                    step: 1500,
                  }}
                  type="time"
                  onChange={onChangeStartsIn}
                  error={startsInError !== ""}
                  helperText={startsInError}
                />
              </div>
            )
          }
          <div className={`selector ${classes.labelAndInput}`}>
            <label className={classes.label}>{t("lobby.Create table.betting limit")}:</label>
            <Select
              className={classes.select}
              value={bettingLimit}
              onChange={onChangeBettingLimit}
            >
              {bettingLimits.map(limit => (
                <MenuItem key={limit} value={limit}>{limit}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.labelAndInputNoColor}>
            <DefaultCheckBox
              checked={isPrivate}
              onChange={(event) => setIsPrivate(event.target.checked)}
              name={"private"}
              label={t("lobby.Create table.Private")}/>
          </div>
        </div>
      </DefaultDialog>
    </div>
  );
}

export default CreateTable