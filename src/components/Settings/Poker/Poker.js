import React, {useEffect, useState} from "react";
import {getUserAutoConfig, setUserAutoConfig} from "../../../backend/table";
import DefaultCheckBox from "../../UI/DefaultCheckBox/DefaultCheckBox";
import DefaultButton from "../../UI/Button/DefaultButton/DefaultButton";
import Loader from "../../UI/Loader/Loader";
import {backendError} from "../../../backend/error";
import {useTranslation} from "next-i18next";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    color: "white",
  }
}));

const Poker = () => {
  const { t } = useTranslation();
  const classes = useStyles()

  const [muck, setMuck] = useState(false)
  const [topUp, setTopUp] = useState(false)
  const [rebuy, setRebuy] = useState(false)
  const [isLoaded, setLoaded] = useState(false)
  const [isError, setError] = useState(false)
  const [isSuccess, setSuccess] = useState(false)

  useEffect(() => {
    getUserAutoConfig()
      .then(config => {
        setMuck(config.autoMuck)
        setTopUp(config.autoTopUp)
        setRebuy(config.autoRebuy)
        setLoaded(true)
      })
      .catch((e) => {
        backendError(e)
        setLoaded(true)
        setError(true)
      })
  }, [])

  const saveConfig = () => {
    setUserAutoConfig(muck, topUp, rebuy)
      .then(() => setSuccess(true))
      .catch((e) => {
        backendError(e)
        setError(true)
      })
  }

  if (!isLoaded) {
    return <Loader/>
  }

  return (
    <div className={classes.root}>
      <DefaultCheckBox
        checked={muck}
        onChange={(e) => setMuck(e.target.checked)}
        label={t("autoConfig.Muck")}
      />
      <DefaultCheckBox
        checked={topUp}
        onChange={(e) => setTopUp(e.target.checked)}
        label={t("autoConfig.TopUp")}
      />
      <DefaultCheckBox
        checked={rebuy}
        onChange={(e) => setRebuy(e.target.checked)}
        label={t("autoConfig.Rebuy")}
      />
      {isSuccess && <div style={{color: "green"}}>Successfully changed</div>}
      {isError && <div style={{color: "red"}}>Something went wrong</div>}
      <DefaultButton onClick={saveConfig}>Save</DefaultButton>
    </div>
  )
}

export default Poker
