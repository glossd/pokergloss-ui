import React, {useState} from 'react'
import firebase from 'firebase/app';
import 'firebase/auth';

import Footer from "../components/Footer/Footer";
import SignButton from "../components/UI/Button/SignButton/SignButton";
import {useTranslation} from "next-i18next";
import {Input} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {useRouter} from "next/router";
import Link from "next/link";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";

function ForgotPassword() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState('')

  function isValidEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(String(email))
  }

  function onChangeEmail(inputEmail) {
    setEmail(inputEmail)
    if (!isValidEmail(inputEmail)) {
      setEmailMessage('you must enter a valid email')
    } else {
      setEmailMessage('')
    }
  }

  // https://stackoverflow.com/questions/54515444/how-to-reset-firebase-auth-password-in-react-native
  function resetPassword() {
    setEmailMessage('We\'ve sent password reset instructions to your email address')

    let actionCodeSettings = {
      url: 'https://pokerblow.com/signin',
    }

    firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).catch((error) => {
      console.error(error.message)
      setEmailMessage(error.message)
    });
  }

  const landingPage = () => {
    router.push("/")
  }

  return (
    <div>
      <SEO title={"ForgotPassword.title"} description={"ForgotPassword.description"}/>
      <div>
        <img className="sign-page-poker-blow-logo" src="https://storage.googleapis.com/pokerblow/logo/Pokerblow-logo-1.png"
             onClick={landingPage} alt="logo" />
      </div>
      <div className='sign-page'>
        <div>
          <h1>{t("Login.Forgot password")}</h1>
          <form className='sign-page-form'>
            <div className='sign-page-form-control-container'>
              <FormControl>
                <Input
                  name={"email"}
                  placeholder={t("Login.email")}
                  type={"email"}
                  value={email}
                  onChange={e => onChangeEmail(e.target.value)}
                />
              </FormControl>
            </div>
            <div>
              {emailMessage === 'you must enter a valid email' ?
                  <p className='sign-error'>{emailMessage}</p> :
                  <p className='sign-message'>{emailMessage}</p>}
            </div>

            <div className='sign-page-button'>
              <SignButton
                onClick={resetPassword}
                disabled={emailMessage !== '' || email === ''}
              >{t("Login.Change Password")}</SignButton>
            </div>

            <div className='sign-page-links'>
              <Link href="/signin"><a className='sign-link'>{t("Login.Sign In Title")}</a></Link>
              <Link href="/"><a className='sign-link' >{t("Login.Go Home")}</a></Link>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default ForgotPassword