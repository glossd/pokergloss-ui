import React from "react";
import DefaultDialog from "../../../UI/DefaultDialog/DefaultDialog";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  infoContainer: {
    textAlign: 'center'
  },
  attentionIcon: {
    color: 'yellow',
    width: '40px',
    height: '40px',
  },
  attentionText: {
    fontSize: '16px'
  }
}));

const SignInDialog = ({open, setOpen}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const classes = useStyles();

  const openSignIn = () => {
    router.push("/signin")
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DefaultDialog
      open={open}
      onClose={handleClose}
      action={{text: t("table.Popup.sign in"), onClick: openSignIn}}
      cancel={{text: t("stay"), onClick: handleClose}}
    >
      <div className={classes.infoContainer}>
        <div>
          <ReportProblemIcon className={classes.attentionIcon}/>
        </div>
        <div className={classes.attentionText}>{t("table.Popup.RedirectDialogMessage")}</div>
      </div>
    </DefaultDialog>
  )
}

export default SignInDialog