import React from "react";
import Medal from "./Medal";

import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {ModelAchievementTypeEnum} from "@pokergloss/achievement-client-typescript";

function AchievementMedal({achievement, medalLength = 5}) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')

  const textStyle = {
    fontSize: `${medalLength/7.69}vw`,
    width: `${medalLength*7.7/7.69}vw`,
    height: `${medalLength*6.9/7.69}vw`
  }

  const multiLineName = (name) => {
    const words = name.split(" ")
    if (words.length === 0) {
      return ""
    }
    let acc = words[0]
    let lastLine = ""
    for (let i = 1; i < words.length; i++) {
      if (words[i-1].length < 3 && !lastLine.includes(" ")) {
        acc += ` ${words[i]}`
        lastLine += ` ${words[i]}`
      } else {
        acc += `\n${words[i]}`
        lastLine = words[i]
      }
    }
    return acc
  }

  const achievementName = () => {
    switch (achievement.type) {
      case ModelAchievementTypeEnum.Hand:
        return t(`table.HandName.${achievement.name}`)
      default:
        return achievement.name
    }
  }

  const medalColors = (level) => {
    switch (level) {
      case 0: return {first: '#48494b', second: '#000000'} // zero level
      case 1: return {first: '#e85e31', second: '#280500'} // copper
      case 2: return {first: '#ffffff', second: '#1f1e1e'} // silver
      case 3: return {first: '#ffdf99', second: '#c9b101'} // gold
      case 4: return {first: '#c9d9e0', second: '#00f4ff'} // diamond
      case 5: return {first: '#ff0000', second: '#000001'} // red-diamond
      case 6: return {first: '#0f0fe8', second: '#000002'} // blue-diamond
      case 7: return {first: '#00ff2a', second: '#000003'} // green-diamond
      default: return ''
    }
  }

  return (
    <div className='achievement-medal-container'>

      <div style={textStyle} className='achievement-medal-text achievement-medal-name'>
        {multiLineName(achievementName())}
      </div>
      <div style={textStyle} className='achievement-medal-text achievement-medal-level'>
        {achievement.level}
      </div>

      <Medal firstColor={medalColors(achievement.level).first} secondColor={medalColors(achievement.level).second}/>

      <div className={`tooltip-achievement-cell-common ${isMobile ? 'tooltip-achievement-cell-mobile' : 'tooltip-achievement-cell-desktop'}`}>
        <div><span style={{fontWeight: 'bold'}}>{t('AchievementMedal.Level')}</span> <span style={{color: '#67e207'}}>
          {achievement.level}</span>, {achievement.count}/{achievement.nextLevelCount}</div>
        <div>{t('AchievementMedal.NextLevelReward')} {achievement.nextLevelPrize} {t('AchievementMedal.Chips')}</div>
      </div>

    </div>
  )
}

export default AchievementMedal