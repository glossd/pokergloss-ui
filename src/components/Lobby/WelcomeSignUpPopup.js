import React from "react";
import {setIsJustSignUp} from "../../redux/actions/lobby";
import DefaultDialog from "../UI/DefaultDialog/DefaultDialog";
import {connect} from "react-redux";
import {useTranslation} from "next-i18next";

const WelcomeSignUpPopup = ({isJustSignUp, setIsJustSignUp}) => {
  if (!isJustSignUp) {
    return <div/>
  }

  const handleClose = () => {
    setIsJustSignUp(false)
  };

  const {t} = useTranslation();

  return (
    <DefaultDialog
      open={isJustSignUp}
      onClose={handleClose}
      title={t("WelcomeSignUpPopup.title")}
      action={{text: t("WelcomeSignUpPopup.action"), onClick: handleClose}}
    >
      <div className='welcome-message'>
        <h3>{t("WelcomeSignUpPopup.paragraph1")}</h3>
        <h1>2,500</h1>
        <h2>{t("WelcomeSignUpPopup.paragraph2")}</h2>
        <div className='displayed'>
          <img className='welcome-chip-image'
               src='https://storage.googleapis.com/pokerblow/red-chip-2.svg'
               alt='chips'
          />
        </div>
      </div>
    </DefaultDialog>
  )
}

function mapStateToProps(state) {
  return {
    isJustSignUp: state.lobby.isJustSignUp
  }
}

export default connect(mapStateToProps, {setIsJustSignUp})(WelcomeSignUpPopup)