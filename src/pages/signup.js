import React, {useEffect, useState} from "react";
import {checkUsername, signUpUser} from "../backend/profile";
import {signInWithCustomToken} from "../auth/Firebase";

import {connect} from "react-redux";
import {setIsJustSignUp} from "../redux/actions/lobby";
import Footer from "../components/Footer/Footer";
import {deleteBonusDay} from "../components/bonusStorage/bonusStorage";
import {setIsAnonymous, setIsAuthenticated, setIsEmailVerified} from "../redux/actions/auth";
import {useTranslation} from "next-i18next";
import {validateUsername} from "../components/util/validateUsername";
import SignButton from "../components/UI/Button/SignButton/SignButton";
import {Input, InputAdornment} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import * as ReactGA from "react-ga";
import {backendError} from "../backend/error";
import {browserName, osName} from 'react-device-detect';
import publicIp from "public-ip";
import {useRouter} from "next/router";
import Link from "next/link";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";

const useStyles = makeStyles(() => ({
  visibilityIcon: {
    color: "#fff",
  },
}));

function SignUpPage({setIsJustSignUp, setIsAuthenticated, setIsEmailVerified, setIsAnonymous}) {
  const {t} = useTranslation();
  const router = useRouter();
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [checkUsernameMessage, setCheckUsernameMessage] = useState('');

  const [clientIP, setClientIP] = useState("")

  const getClientIp = async () => await publicIp.v4({
    fallbackUrls: [ "https://ifconfig.co/ip" ]
  });

  useEffect(() => {
    getClientIp()
      .then(ip => setClientIP(ip))
      .catch(e => console.error("Failed to find IP", e))
  }, [])

  function loader() {
    return (
      <div className='loader'>
        <div className="lds-ring">
          <div/>
          <div/>
          <div/>
          <div/>
        </div>
      </div>
    )
  }

  const onSignUpClick = () => {
    setLoading(true)

    // mock
    // if (true) {
    //   setIsAuthenticated(dispatch, true)
    //   router.push("/lobby/live")
    //   return
    // }
    signUpUser(username, email, password, clientIP, navigator.language, osName, browserName)
      .then((data) => {
        signInWithCustomToken(data.custom_token)
          .then((res) => {
              deleteBonusDay()
              setIsAuthenticated(true)
              setIsEmailVerified(res.user.emailVerified)
              setIsJustSignUp(true)
              router.push("/verify-email")
            }
          )
          .catch((error) => {
            setError(error.message) || setLoading(true)
            backendError(error)
          })
      })
      .catch((err) => {
        backendError(err)
        setLoading(false)
        if (err.response && err.response.status === 400) {

          if (err.response.data.message.includes('"message": "INVALID_EMAIL"')) {
            setError('you must enter a valid email')
          } else if (err.response.data.message.includes('"message": "EMAIL_EXISTS"')) {
            setError('user with this email is already registered')
          } else {
            // e.g. username, email are taken
            setError(err.response.data.message)
          }
        } else {
          setError("Something went wrong, please try to sing up later")
        }
      })
    ReactGA.event({
      category: "SingUpPage",
      action: "Clicked Sign Up",
    });
  };

  function onChangeUsername(inputUsername) {
    setUsername(inputUsername)
    checkUsername(inputUsername)
      .then(data => {
        setCheckUsernameMessage(data.message)
      })
      .catch(backendError)
  }

  // https://www.w3resource.com/javascript/form/email-validation.php
  function validateEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(String(email))
  }

  function onChangeEmail(inputEmail) {
    setEmail(inputEmail)
    if (!validateEmail(inputEmail)) {
      setIsEmailError(true)
    } else if (isEmailError) {
      setIsEmailError(false)
    }
  }

  function onChangePassword(inputPassword) {
    setPassword(inputPassword)
    if (inputPassword.length < 6) {
      setIsPasswordError(true)
    } else if (isPasswordError) {
      setIsPasswordError(false)
    }
  }

  function areFieldsEmpty() {
    return username === '' || email === '' || password === ''
  }

  function isUsernameAlreadyExists() {
    return checkUsernameMessage === 'username already exists'
  }

  function signUpErrors() {
    return validateUsername(username) !== '' || isEmailError || isPasswordError || isUsernameAlreadyExists()
  }

  const landingPage = () => {
    router.push("/")
  }

  function changePasswordType(type) {
    if (type === 'password') {
      setPasswordType('text')
    } else setPasswordType('password')
  }

  function showPassword(type) {
    return type === 'text';
  }

  return (
    <div>
      <SEO title={"Signup.title"} description={"Signup.description"}/>
      <div>
        <img className="sign-page-poker-blow-logo"
             src="https://storage.googleapis.com/pokerblow/logo/Pokerblow-logo-1.png"
             onClick={landingPage} alt="logo"/>
      </div>
      <div className='sign-page'>
        <div>
          <h1>{t("Login.Sign Up Title")}</h1>

          <form className='sign-page-form'>
            {error && <div className='sign-error'>{error}</div>}
            <div className='sign-page-form-control-container'>
              <FormControl>
                <Input
                  name={"username"}
                  required={true}
                  placeholder={t("Login.username")}
                  type={"text"}
                  value={username}
                  onChange={e => onChangeUsername(e.target.value)}
                />
              </FormControl>
              {
                username !== '' &&
                <p className='sign-error'>{validateUsername(username)}</p>
              }
              {isUsernameAlreadyExists() && <p className='sign-error'>{checkUsernameMessage}</p>}
            </div>
            <div className='sign-page-form-control-container'>
              <FormControl>
                <Input
                  name={"email"}
                  required={true}
                  placeholder={t("Login.email")}
                  type={"email"}
                  value={email}
                  onChange={e => onChangeEmail(e.target.value)}
                />
              </FormControl>

              {isEmailError && <p className='sign-error'>you must enter a valid email</p>}
            </div>
            <div className='sign-page-form-control-container'>
              <FormControl>
                <Input
                  required={true}
                  placeholder={t("Login.password")}
                  type={passwordType}
                  value={password}
                  onChange={e => onChangePassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => changePasswordType(passwordType)}
                      >
                        {showPassword(passwordType) ?
                          <Visibility className={classes.visibilityIcon}/> :
                          <VisibilityOff className={classes.visibilityIcon}/>}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              {isPasswordError && <p className='sign-error'>password must be more than 6</p>}
            </div>
            <div>
              {loading ?
                loader()
                :
                <div className='sign-page-button'>
                  <SignButton
                    type="button"
                    onClick={onSignUpClick}
                    disabled={signUpErrors() || areFieldsEmpty()}
                  >
                    {t("Login.Sign Up Action")}
                  </SignButton>
                </div>}
            </div>
            <div className='sign-page-links'>
              <Link href="/signin"><a className='sign-link' >{t("Login.Sign In Title")}</a></Link>
              <Link href="/"><a className='sign-link'>{t("Login.Go Home")}</a></Link>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(null, {setIsJustSignUp, setIsAuthenticated, setIsEmailVerified, setIsAnonymous})(SignUpPage)
