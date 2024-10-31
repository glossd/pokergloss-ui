import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ChangeUserName from "../ChangeUsername/ChangeUserName";
import UploadAvatar from "../UploadAvatar/UploadAvatar";
import {DefaultTab, DefaultTabs} from "../../UI/Tabs";
import ChangePassword from "../ChangePassword/ChangePassword";
import {useTranslation} from "next-i18next";
import Poker from "../Poker/Poker";
import Notification from "../Notification";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '30px',
    margin: 'auto',
    flexGrow: 1,
    display: 'flex',
    height: '50vh',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    color: '#fff',
    marginRight: '10%',
  },
  tab: {
    fontWeight: 'bold',
  }

}));

export default function VerticalTabs() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <DefaultTabs
        className="lobby-type-tabs"
        orientation="vertical"
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="vertical settings tabs"
      >
        <DefaultTab label={t("Poker")} {...a11yProps(0)} />
        <DefaultTab label={t("SettingsPage.Notification.Title")} {...a11yProps(1)} />
        <DefaultTab label={t("SettingsPage.ChangeUsername.Title")} {...a11yProps(2)} />
        <DefaultTab label={t("SettingsPage.UploadAvatar.Title")} {...a11yProps(3)} />
        <DefaultTab label={t("SettingsPage.ChangePassword.Title")} {...a11yProps(4)} />
      </DefaultTabs>

      <TabPanel value={value} index={0}>
        <Poker/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Notification/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ChangeUserName/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <UploadAvatar/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ChangePassword/>
      </TabPanel>
    </div>
  );
}
