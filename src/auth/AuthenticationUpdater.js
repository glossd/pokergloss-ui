import {connect} from "react-redux";
import React, {useEffect} from "react";
import {getCurrentUser} from "./Firebase";
import {setIsAnonymous, setIsAuthenticated, setIsEmailVerified} from "../redux/actions/auth";

const AuthenticationUpdater = ({setIsAuthenticated, setIsEmailVerified, setIsAnonymous}) => {
  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          if (user.isAnonymous) {
            setIsAnonymous(true)
            setIsAuthenticated(true)
            setIsEmailVerified(false)
          } else {
            setIsAuthenticated(true)
            if (user.emailVerified) {
              setIsEmailVerified(true)
            } else {
              setIsEmailVerified(false)
            }
          }
        } else {
          setIsAuthenticated(false)
          setIsEmailVerified(false)
        }
      })
      .catch(e => {
        console.error("AuthenticationUpdater:", e)
        setIsAuthenticated(false)
        setIsEmailVerified(false)
      })
  }, [])
  return <div/>
}

export default connect(null, {setIsAuthenticated, setIsEmailVerified, setIsAnonymous})(AuthenticationUpdater)