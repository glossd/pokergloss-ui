import React from "react";
import Header from "../components/Header/Header";
import {useTranslation} from "next-i18next";
import Footer from "../components/Footer/Footer";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const commonStyles = makeStyles(() => ({
  root: {
    fontSize: "28px",
    color: "white",
    textAlign: "center",
    fontFamily: "'Lobster', Georgia, Times, serif",
    marginBottom: "10vw"
  },
  subtitle: {
    marginTop: "2vw",
    fontSize: "38px",
    fontWeight: "bold"
  },
  overview: {
    margin: "0 15vw"
  },
  personContainer: {
    marginBottom: "2vw",
    display: "flex",
  },
  personName: {
    fontSize: "30px",
    '& > span': {
      fontWeight: "bold"
    }
  }
}));

const desktopStyles = makeStyles(() => ({
  ourTeamContainer: {
    margin: "0 15vw",
    textAlign: "left"
  },
  personContainer: {
    marginBottom: "5vw",
    display: "flex"
  },
  personPhoto: {
    height: "375px",
    marginRight: "2vw"
  }
}));

const portraitStyles = makeStyles(() => ({
  root: {
    fontSize: "22px"
  },
  subtitle: {
    fontSize: "28px"
  },
  ourTeamContainer: {
    textAlign: "center",
    margin: "0 15vw"
  },
  personContainer: {
    marginBottom: "2vw",
    display: "flex",
    flexFlow: "column",
  },
  personPhoto: {
    width: "300px",
    display: "block",
    margin: "auto"
  }
}))

const mobileStyles = makeStyles(() => ({
  ourTeamContainer: {
    textAlign: "center",
    margin: "0 15vw"
  },
  personContainer: {
    marginBottom: "5vw",
    flexFlow: "column",
    display: "flex"
  },
  personPhoto: {
    width: "230px",
    display: "block",
    margin: "auto"
  }
}))

function AboutUs() {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isPortrait ? portraitStyles() : (isMobile ? mobileStyles() : desktopStyles())
  const commonClasses = commonStyles()

  const {t} = useTranslation();
  const team = [
    {
      id: 1,
      name: t("AboutUsPage.DennisGloss.Name"),
      position: t("AboutUsPage.DennisGloss.Position"),
      photoURL: 'https://storage.googleapis.com/pokerblow/about-us/denis-photo.jpg',
      description: t("AboutUsPage.DennisGloss.Text")
    }
  ]

  return (
    <div>
      <SEO title={"AboutUsPage.title"} description={"AboutUsPage.description"}/>
      <Header
        links={[
          {name: t("Header.Lobby"), to: '/lobby/live'},
          {name: t("Header.AboutUs")},
        ]}
      />
      <div className={commonClasses.root}>
        <div>
          <div className={commonClasses.subtitle}>{t("AboutUsPage.OurMissionHeader")}</div>
          <div className={commonClasses.overview}>{t("AboutUsPage.OurMissionText")}</div>
        </div>
        <div>
          <div className={commonClasses.subtitle}>{t("AboutUsPage.OurTeamHeader")}</div>
          <div className={classes.ourTeamContainer}>
            {team.map(person => (
              <div key={person.id} className={classes.personContainer}>
                <img className={classes.personPhoto} src={person.photoURL} alt="photoURL"/>
                <div>
                  <div className={commonClasses.personName}><span>{person.name}</span> - {person.position}</div>
                  <div>{person.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className={commonClasses.subtitle}>{t("AboutUsPage.ContactUsHeader")}</div>
          <div className={commonClasses.overview}>{t("AboutUsPage.ContactUsText")}</div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export const getStaticProps = async ({locale}) => ({props: {...await serverSideTranslations(locale)}})
export default AboutUs