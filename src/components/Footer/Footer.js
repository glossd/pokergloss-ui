import React from "react";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useRouter} from "next/router";
import {makeStyles} from "@material-ui/core/styles";
import YouTubeIcon from "@material-ui/icons/YouTube";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles(() => ({
  linkIcon: {
    color: 'white',
    width: '35px',
    height: '35px',
    margin: '10px',
    '&:hover': {
      filter: 'invert(57%) sepia(81%) saturate(2433%) hue-rotate(159deg) brightness(102%) contrast(106%)'
    },
  }
}));

export default function Footer() {
  const classes = useStyles();
  const {t} = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const router = useRouter();

  const handleOpenAboutUs = () => {
    router.push("/about-us")
  }

  return (
    <div className={`footer-container ${isMobile ? 'footer-container-font-mobile' : 'footer-container-font'}`}>
      <div className='footer-container-column'>
        <div>
          Copyright © PokerGloss {new Date().getFullYear()}
          <button className={'footer-button-policy-terms'} onClick={handleOpenAboutUs}>
            {t("Footer.AboutUs")}
          </button>
        </div>
      </div>
      <div className='footer-container-column'>
        <div>
          <a target="_blank" href='https://github.com/glossd/pokergloss'><GitHubIcon className={classes.linkIcon}/></a>
        </div>
      </div>
      <div className='footer-container-column'>
        <div className='footer-policy-terms'>
          <a href={"/privacy-policy"} target="_blank">
            <button className={'footer-button-policy-terms'}>{t("Footer.Privacy Policy")}</button>
          </a>

          <a href={"/terms-of-use"} target="_blank">
            <button className={'footer-button-policy-terms'}>{t("Footer.Terms of Use")}</button>
          </a>
        </div>
      </div>
    </div>
  )
}