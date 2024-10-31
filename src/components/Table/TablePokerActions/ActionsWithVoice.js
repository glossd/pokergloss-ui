import React, {useEffect, useState} from "react";
import "regenerator-runtime/runtime.js";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IconButton from "@material-ui/core/IconButton";
import {Pause, VoiceOverOff} from "@material-ui/icons";
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import {connect} from "react-redux";
import {setActionsVisibility, setBackendError, setCpBetting} from "../../../redux/actions/table";
import {ModelPlayerLastGameActionEnum, ModelPlayerShowDownActionEnum} from "@pokergloss/table-client-typescript";
import {makeAction, makeShowDownAction} from "../../../backend/table";
import {backendError} from "../../../backend/error";
import {errorMessage} from "../../../backend";
import {getCurrentUserPlayer} from "../util";

const desktopStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '30%',
    left: '1%'
  },
  transcript: {
    position: 'absolute',
    top: '25%',
    whiteSpace: 'nowrap',
    color: 'white'
  }
}));

const mobileStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '5%',
    left: '5%'
  }
}));

const commonStyles = makeStyles(() => ({
  icon: {
    color: "white",
    '&:hover': {
      color: '#4d84a5',
    },
  },
  voiceIcon: {
    color: "green",
  }
}))

const ActionsWithVoice = ({tableId, currentUserPosition, totalRoundBet, bigBlind, totalPot, stack, isDeciding, setBackendError, setActionsVisibility}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()
  const common = commonStyles()

  const [isEnabled, setEnabled] = useState(false)
  const [isListening, setListening] = useState(false)

  function stopListening() {
    if (isListening) {
      setListening(false)
      SpeechRecognition.abortListening()
        .then(() => resetTranscript())
        .catch(e => console.error(e))
    }
  }

  function startListening() {
    if (!isListening) {
      SpeechRecognition.startListening({continuous: true, language: 'en-US'})
        .then(() => setListening(true))
    }
  }

  useEffect(() => {
    return () => {
      SpeechRecognition.abortListening().catch(e => {})
    }
  }, [])

  const doMakeAction = (action, chips) => {
    setActionsVisibility(false)
    makeAction(tableId, currentUserPosition, action, chips)
      .then(() => {
        setCpBetting(0)
      })
      .catch(error => {
        backendError(error)
        setBackendError(errorMessage(error))
        setTimeout(() => setBackendError(''), 2000)
        setActionsVisibility(true)
      })
  }

  const doMakeShowdownAction = (action) => {
    setActionsVisibility(false)
    makeShowDownAction(tableId, currentUserPosition, action)
      .catch((e) => {
        backendError(e)
        setBackendError(errorMessage(e))
        setTimeout(() => setBackendError(''), 2000)
        setActionsVisibility(true)
      })
  }

  const tryStrToNum = (str) => {
    switch (str) {
      case "hundred": return 100
      case "to": return 2
      case "two": return 2
      case "three": return 3
      case "for": return 4
      case "fall":return
      case "four": return 4
      case "phone": return 4;
      case "five": return 5
      case "six": return 6
      case "seven": return 7
      case "eight": return 8
      case "nine": return 9
    }
    return NaN
  }

  const tryShortCuts = (str) => {
    switch (str) {
      case "pot": return totalPot
      case "half pot": return Math.floor(totalPot/2)
      case "min": return 0
      case "max": return stack
    }
    return NaN
  }

  function convertChips(chipsStr) {
    let chips = Number.parseInt(chipsStr)
    if (isNaN(chips)) {
      chips = tryStrToNum(chipsStr)
    }
    if (typeof chips == 'number' && (chipsStr.endsWith("bb") || chipsStr.endsWith("BB"))) {
      chips *= bigBlind
    }
    if (isNaN(chips)) {
      chips = tryShortCuts(chipsStr)
    }
    return chips;
  }

  const commands = [
    {
      command: 'old',
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.6,
      callback: () => {
        console.info("Voice command: fold")
        doMakeAction(ModelPlayerLastGameActionEnum.Fold, 0)
      }
    },
    {
      command: ['fault', 'bolt', 'pulled'],
      callback: () => {
        console.info("Voice command: fold")
        doMakeAction(ModelPlayerLastGameActionEnum.Fold, 0)
      }
    },
    {
      command: ['check', 'chip', 'chuck', "took", "joke"],
      callback: () => {
        console.info("Voice command: check")
        doMakeAction(ModelPlayerLastGameActionEnum.Check, 0)
      }
    },
    {
      command: ['call', 'cool'],
      callback: () => {
        console.info("Voice command: call")
        doMakeAction(ModelPlayerLastGameActionEnum.Call, 0)
      }
    },
    {
      command: ['all in', 'holy', 'bowling', 'owen', 'poen'],
      callback: () => {
        console.info("Voice command: all in")
        doMakeAction(ModelPlayerLastGameActionEnum.AllIn, 0)
      }
    },
    {
      command: ['bet *', 'but *', 'bad *', 'back *', 'bread *', 'bred *', 'brett *'],
      callback: (chipsStr) => {
        console.info("Voice command: bet, chips: " + chipsStr)
        let chips = convertChips(chipsStr);
        if (!isNaN(chips)) {
          if (chips >= stack) {
            doMakeAction(ModelPlayerLastGameActionEnum.AllIn, 0)
          } else {
            doMakeAction(ModelPlayerLastGameActionEnum.Bet, chips)
          }
        }
      }
    },
    {
      command: ['bet', 'but', 'bad', 'back', 'bread', 'bred', 'brett'],
      callback: () => {
        console.info("Voice command: bet min")
        doMakeAction(ModelPlayerLastGameActionEnum.Bet, 0)
      }
    },
    {
      command: ['raise *', 'race *', 'praise *', 'brace *', 'grace *', 'rays *', "ray's *", "price *"],
      callback: (chipsStr) => {
        console.info("Voice command: raise, chips: " + chipsStr)
        let chips = convertChips(chipsStr);
        if (!isNaN(chips)) {
          if (chips >= stack) {
            doMakeAction(ModelPlayerLastGameActionEnum.AllIn, 0)
          } else {
            doMakeAction(ModelPlayerLastGameActionEnum.Raise, chips - totalRoundBet)
          }
        }
      }
    },
    {
      command: ['raise', 'razor', 'race', 'praise', 'brace', 'grace', 'rays', "ray's", "price"],
      callback: () => {
        console.info("Voice command: raise")
        doMakeAction(ModelPlayerLastGameActionEnum.Raise, 0)
      }
    },
    {
      command: ['muck', 'mac', 'mock'],
      callback: () => {
        console.info("Voice command: muck")
        doMakeShowdownAction(ModelPlayerShowDownActionEnum.Muck, 0)
      }
    },
    {
      command: ['show', 'so'],
      callback: () => {
        console.info("Voice command: show")
        doMakeShowdownAction(ModelPlayerShowDownActionEnum.Show, 0)
      }
    },
  ]

  const { transcript, resetTranscript } = useSpeechRecognition({ commands })

  if (currentUserPosition < 0) {
    return <div/>
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div/>
  }

  if (isEnabled) {
    if (isDeciding) {
      startListening()
    } else {
      stopListening()
    }
  } else {
    stopListening()
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => setEnabled(!isEnabled)}>
        {
          isEnabled
          ? isListening ? <RecordVoiceOverIcon className={common.voiceIcon}/> : <Pause className={common.icon}/>
          : <VoiceOverOff className={common.icon}/>
        }
      </IconButton>
      {!isMobile && <span className={classes.transcript}>{transcript}</span>}
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  const currentUserPosition = tableWS.currentUserPosition
  const decidingPosition = tableWS.table.decidingPosition
  const cp = getCurrentUserPlayer(tableWS.table, currentUserPosition)
  return {
    tableId: tableWS.table.id,
    currentUserPosition: tableWS.currentUserPosition,
    totalRoundBet: cp ? cp.totalRoundBet : 0,
    stack: cp ? cp.stack : Number.MAX_SAFE_INTEGER,
    totalPot: tableWS.table.totalPot,
    bigBlind: tableWS.table.bigBlind,
    isDeciding: decidingPosition >= 0 && decidingPosition === currentUserPosition
  }
};


export default connect(mapStateToProps, {setBackendError, setActionsVisibility})(ActionsWithVoice)