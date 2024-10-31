import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {survivalWheelActions} from "../../../redux/actions/news";

const Music = ({isMusicActive, themeId, isSurvivalWheelOpen, survivalWheel, survivalWheelAction}) => {

  const [audioParadiseTheme] = useState(new Audio("https://storage.googleapis.com/pokerblow/sounds/paradise-theme.mp3"))
  const [audioSpiritWorldTheme] = useState(new Audio("https://storage.googleapis.com/pokerblow/sounds/spirit-world-theme.mp3"))
  const [audioHellTheme] = useState(new Audio("https://storage.googleapis.com/pokerblow/sounds/hell-theme.mp3"))

  const [audioRouletteSpinning] = useState(new Audio("https://storage.googleapis.com/pokerblow/sounds/survival-prize.mp3"))
  const [audioVictory] = useState(new Audio("https://storage.googleapis.com/pokerblow/sounds/cheering.mp3"))

  useEffect(() => {
    return () => {
      stopAllThemeIdAudios()
      stopAudio(audioRouletteSpinning)
    }
  }, [])

  useEffect(() => {
    stopAllThemeIdAudios()

    if (isMusicActive && themeId) {
      playThemeIdAudio()
    } else {
      stopAudio(audioRouletteSpinning)
    }
  }, [isMusicActive, themeId])

  useEffect(() => {
    if (isSurvivalWheelOpen && survivalWheel.wonSlotIdx !== -1) {
      if (survivalWheelAction ===  survivalWheelActions.ROTATING) {
        stopAllThemeIdAudios()
        playAudioOnce(audioRouletteSpinning, 0.1)
      }
      if (survivalWheelAction === survivalWheelActions.STOPPING) {
        playAudioOnce(audioVictory, 0.05)
      }
    }
  }, [survivalWheelAction])

  function playAudio(audio, volume) {
    audio.loop = true
    audio.volume = volume
    audio.play()
  }

  function playAudioOnce(audio, volume) {
    audio.volume = volume
    audio.play()
  }

  function stopAudio(audio) {
    audio.pause()
    audio.currentTime = 0
  }

  function playThemeIdAudio() {
    let audio

    switch (themeId) {
      case 'paradise':
        audio = audioParadiseTheme
        break
      case 'spirit-world':
        audio = audioSpiritWorldTheme
        break
      case 'hell':
        audio = audioHellTheme
        break
    }

    playAudio(audio, 0.1)
  }

  function stopAllThemeIdAudios() {
    stopAudio(audioParadiseTheme)
    stopAudio(audioSpiritWorldTheme)
    stopAudio(audioHellTheme)
  }

  return <div/>
}

const mapStateToProps = state => {
  const { tableWS, news } = state
  let table = tableWS.table;
  return {
    themeId: table.themeId,
    isSurvivalWheelOpen: news.isSurvivalWheelOpen,
    survivalWheel: news.survivalWheel,
    survivalWheelAction: news.survivalWheelAction
  };
};

export default connect(mapStateToProps)(Music)