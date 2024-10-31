import React, {useEffect, useState} from "react";

import {getProfile} from "../../backend/profile";
import Header from "../../components/Header/Header";
import {getUserBalanceWithRank} from "../../backend/bank";
import {getUserAchievements, getUserPoints, getUserStatistics} from "../../backend/achievement";
import LevelProgress from "../../components/Header/LevelProgress";
import AchievementMedal from "../../components/Medal/AchievementMedal";
import {avatarUrlOrDefault} from "../../auth";
import SearchProfiles from "../../components/Profile/SearchProfiles/SearchProfiles";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";
import {setProfileUsername} from "../../redux/actions/profile";
import {backendError} from "../../backend/error";
import {listUserItems} from "../../backend/market";
import {itemIcon} from "../../components/market/itemStore";
import TextShadow from "../../components/UI/TextShadow/TextShadow";
import SignButton from "../../components/UI/Button/SignButton/SignButton";
import EmailIcon from '@material-ui/icons/Email';
import {chooseUser} from "../../redux/actions/messenger";
import {getSurvivalScore} from "../../backend/survival";
import ChipIcon from "../../components/UI/ChipIcon";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../../components/SEO";

const Username = ({profileUsername, setProfileUsername, chooseUser}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const { username } = router.query

  const [user, setUser] = useState(null)
  const [bankInfo, setBankInfo] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [points, setPoints] = useState(null)
  const [profileError, setProfileError] = useState('')
  const [statistics, setStatistics] = useState(null)
  const [survivalScore, setSurvivalScore] = useState(null)
  const [items, setItems] = useState([])
  const medalLength = 10

  useEffect(() => {

    if (!profileUsername) {
      setProfileUsername(username)
    } else {
      router.push("/u/" + profileUsername)
      getProfile(profileUsername)
        .then(user => {
          setUser(user)

          getUserBalanceWithRank(user.userId)
            .then(userBank => {
              setBankInfo(userBank)
            })
            .catch(backendError)

          getUserAchievements(user.userId)
            .then(userAchievements => {
              setAchievements(userAchievements)
            })
            .catch(backendError)

          getUserPoints(user.userId)
            .then(userPoints => {
              setPoints(userPoints)
            })
            .catch(backendError)

          getUserStatistics(user.userId)
            .then(userStatistics => {
              setStatistics(userStatistics)
            })
            .catch(backendError)
          getSurvivalScore(user.userId)
            .then(score => {
              setSurvivalScore(score)
            })
            .catch(backendError)

          listUserItems(user.userId)
            .then(items => {
              setItems(items)
            })
            .catch(backendError)
        })
        .catch(error => {
          backendError(error)
          if (error.response.status === 404) {
            router.push("/404-error")
          }
          if (error.response.status === 500) {
            setProfileError('Something went wrong. Please try again later.')
          }
        })
    }

  }, [profileUsername])

  const goToMessenger = () => {
    chooseUser(user)
    router.push("/messenger")
  }

  return (
    <div>
      <SEO titleTranslated={`${username} - ${t("ProfilePage.title")}`} description={"ProfilePage.description"}/>
      <div>
        <Header
          links={[
            {name: t("Header.Lobby"), to: '/lobby/live'},
            {name: `${t("Header.User")}: ${username}`},
          ]}
        />

        <div className='profile-page-container'>
          <div className='profile-error-message'>
            {profileError}
          </div>

          <div className='main-info-container'>
            <div>
              {user && <img className='main-info-picture' src={avatarUrlOrDefault(user.picture)} alt="loading"/>}
              {points && <LevelProgress exp={points}/>}
            </div>

            {points && <TextShadow className='main-info-player-level'>{points.level}</TextShadow>}
            <div>
              <div className='main-info-username'>{username}</div>
              {bankInfo &&
              <>
                <div className='main-info-chips-container'>
                  <ChipIcon className={'main-info-chip-img'}/>
                  <div className='main-info-chip-number'>{bankInfo.balance}</div>
                </div>
                <div className='main-info-rating-place'>{t("ProfilePage.RatingPlace")} {bankInfo.rank}</div>
              </>}
            </div>
          </div>

          <div className='profile-send-message-btn'>
            {user && <SignButton onClick={goToMessenger}>{t("ProfilePage.SendMessage")} &#10072; <EmailIcon/></SignButton>}
          </div>

          <div className='search-profiles-container'>
            <SearchProfiles/>
          </div>

          {statistics &&
          <div className='profile-statistics-container'>
            <div className='profile-statistics-info'>
              <div>
                <div>{t("ProfilePage.NumberOfGames")}</div>
                <div>{t("ProfilePage.WonGames")}</div>
              </div>
              <div>
                <div>{statistics.gameCount}</div>
                <div>{statistics.winPercent}%</div>
              </div>
              <div>
                <div>{t("ProfilePage.MadeAllIn")}</div>
                <div>{t("ProfilePage.MadeFold")}</div>
              </div>
              <div>
                <div>{statistics.allInPercent}%</div>
                <div>{statistics.foldPercent}%</div>
              </div>
              {
                survivalScore != null &&
                <>
                  <div><div>{t("ProfilePage.SurvivalLevel")}</div></div>
                  <div><div>{survivalScore.level}</div></div>
                </>
              }
            </div>
          </div>}

          {achievements &&
          <div className='profile-achievements-container'>
            {achievements.map((achievement, index) => {
              return (
                <div key={achievement.name} className='profile-achievement-cell'
                     style={{
                       zIndex: `${achievements.length - index}`,
                       width: `${medalLength}vw`,
                       height: `${medalLength}vw`
                     }}>
                  <AchievementMedal
                    achievement={achievement}
                    medalLength={medalLength}/>
                </div>
              )
            })}
          </div>}
          <div className='profile-items-container'>
            {items.map((userItem) => {
              return (
                <div key={userItem.itemId} className='profile-items-cell'>
                  {itemIcon(userItem.itemId)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const {profile} = state
  return {
    profileUsername: profile.profileUsername
  }
}

export const getServerSideProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(mapStateToProps, {setProfileUsername, chooseUser})(Username)