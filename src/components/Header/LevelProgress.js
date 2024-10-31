import React from 'react';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createTheme } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: '1px 0',
  },
});

const theme = createTheme({
  overrides: {
    MuiLinearProgress: {
      root: {
        height: '5px',
        borderRadius: '5px'
      },
      barColorPrimary: {
        backgroundColor: '#05ab05',
      },
      colorPrimary: {
        backgroundColor: '#cecece',
      },
    },
  },
});

function LevelProgress({exp}) {
  const classes = useStyles();

  const calcProgress = () => {
    return ((exp.points - exp.startLevelPoints) * 100) / (exp.nextLevelPoints - exp.startLevelPoints)
  }

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <LinearProgress variant="determinate" value={calcProgress()} />
      </ThemeProvider>
    </div>
  );
}

export default LevelProgress