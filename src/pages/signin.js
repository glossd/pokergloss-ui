import React, {useState} from 'react'
import firebase from 'firebase/app';
import 'firebase/auth';
import {deleteBonusDay} from "../components/bonusStorage/bonusStorage";
import Footer from "../components/Footer/Footer";
import {connect} from "react-redux";
import {setIsAnonymous, setIsAuthenticated, setIsEmailVerified} from "../redux/actions/auth";
import {useTranslation} from "next-i18next";
import SignButton from "../components/UI/Button/SignButton/SignButton";
import {Input, InputAdornment} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter} from "next/router";
import Link from "next/link";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";

const useStyles = makeStyles(() => ({
  visibilityIcon: {
    color: "#fff",
  },
}));

function SignInPage ({setIsAuthenticated, setIsEmailVerified, setIsAnonymous}) {
  const { t } = useTranslation();
  const router = useRouter();
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordType, setPasswordType] = useState('password');

  const handleForm = e => {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user) {
          console.info("Signed in!")
          deleteBonusDay()
          setIsAnonymous(false)
          setIsAuthenticated(true)
          setIsEmailVerified(res.user.emailVerified)
          router.push("/lobby/live")
        }
      })
      .catch(e => {
        console.error(e)

        if (e.code === 'auth/user-not-found') {
          setError(t("Login.errors.auth/user-not-found"))
        } else {
          setError(e.message);
        }
      });
  };

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

  const landingPage = () => {
    router.push("/")
  }

  function changePasswordType (type) {
    if (type === 'password') {
      setPasswordType('text')
    } else setPasswordType('password')
  }

  function showPassword(type) {
    return type === 'text';
  }

  return (
    <div>
      <SEO title={"Signin.title"} description={"Signin.description"}/>
      <div>
        <img className="sign-page-poker-blow-logo" src="https://storage.googleapis.com/pokerblow/logo/Pokerblow-logo-1.png"
             onClick={landingPage} alt="logo" />
      </div>
      <div className='sign-page'>
        <div>
          <h1>{t("Login.Sign In Title")}</h1>

          <form onSubmit={e => handleForm(e)} className='sign-page-form'>
            {error && <div className="sign-error">{error}</div>}
            <div className='sign-page-form-control-container'>
              {/*TODO https://www.npmjs.com/package/email-validator*/}
              <FormControl>
                <Input
                  name={"email"}
                  placeholder={t("Login.email")}
                  type={"email"}
                  value={email}
                  onChange={e => onChangeEmail(e.target.value)}
                />
              </FormControl>
              {isEmailError && <p className='sign-error'>you must enter a valid email</p>}
            </div>
            <div className='sign-page-form-control-container'>
              {/*TODO https://www.npmjs.com/package/password-validator*/}
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
                          <Visibility className={classes.visibilityIcon} /> :
                          <VisibilityOff className={classes.visibilityIcon} />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {isPasswordError && <p className='sign-error'>password must be more than 6</p>}
            </div>

            <div className='sign-page-button'>
              <SignButton
                type="submit"
                disabled={email==='' || password==='' || isEmailError || isPasswordError}
              >
                {t("Login.Sign In Action")}
              </SignButton>
            </div>

            <div className='sign-page-links'>
              <Link href="/signup"><a className='sign-link'>{t("Login.Sign Up Title")}</a></Link>
              <Link href="/"><a className='sign-link'>{t("Login.Go Home")}</a></Link>
              <Link href="/forgot-password"><a className='sign-link'>{t("Login.Forgot password")}</a></Link>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect( null, { setIsAuthenticated, setIsEmailVerified, setIsAnonymous})(SignInPage);
