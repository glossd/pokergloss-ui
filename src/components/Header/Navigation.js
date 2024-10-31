import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import * as ReactGA from "react-ga";

import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import {ArrowBack} from "@material-ui/icons";
import {useRouter} from "next/router";
import Link from "next/link";

const useStyles = makeStyles(() => ({
  title: {
    marginLeft: '2%',
    marginTop: '5px',
  },
  links: {
    color: 'rgb(105, 151, 244)',
    textDecoration: 'underline',
    textAlign: 'center',
    '&:hover': {
      textDecoration: 'none',
      color: '#52b3d2',
      cursor: 'pointer'
    }
  },
  separator: {
    color: '#fff'
  },
  backMobileButton: {
    color: "white",
    backgroundColor: "#14252f"
  }
}));

const Navigation = ({links, analyticsCategory}) => {
  const classes = useStyles()
  const router = useRouter();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')

  const beforeRoute = (name) => {
    if (analyticsCategory) {
      ReactGA.event({
        category: analyticsCategory,
        action: "Header " + name,
      });
    }
  }

  const landingPage = () => {
    if (analyticsCategory) {
      ReactGA.event({
        category: analyticsCategory,
        action: "Header landing",
      });
    }
    router.push("/")
  }

  const logo = <img className='header-logo' src="https://storage.googleapis.com/pokerblow/logo/Pokerblow-logo-1.png"
                    onClick={landingPage} alt="logo"/>

  if (isMobile) {
    if (!links || links.length < 2) {
      return logo
    } else {
      const goLink = links[links.length-2]
      return (
        <IconButton className={classes.backMobileButton} onClick={() => {
          beforeRoute(goLink.name)
          router.push(goLink.to)
        }}>
          <ArrowBack/>
        </IconButton>
      )
    }
  }
  return (
    <>
      {logo}
      <Typography className={classes.title} component={'span'}>
        <Breadcrumbs className={classes.separator} separator={<NavigateNextIcon/>} aria-label="breadcrumb">
          {links.map((l, idx) => {
            const linkSpan = <span className={isMobile ? '' : 'breadcrumb-links'}
                                   key={idx}>{l.name}</span>
            if (idx === links.length - 1) {
              return linkSpan
            } else {
              return (
                <Link onClick={() => beforeRoute(l.name)} href={l.to} key={idx} passHref>
                  <a className={classes.links}>{linkSpan}</a>
                </Link>
              )
            }
          })}
        </Breadcrumbs>
      </Typography>
    </>
  )
}

export default Navigation