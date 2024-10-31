import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DefaultSwitch from "../UI/DefaultSwitch/DefaultSwitch";
import {connect} from "react-redux";
import {setIsChipsInBB} from "../../redux/actions/table";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    left: '0.8%',
    top: '27%'
  },
  switch: {
    color: '#ffffff'
  }
}));

const BigBlindSwitch = ({isChipsInBB, setIsChipsInBB}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-device-width: 1224px)');

  function onIsChipsInBBChange() {
    setIsChipsInBB(!isChipsInBB)
  }

  if (isMobile) {
    return <div/>
  }

  return (
    <div className={classes.root}>
      <DefaultSwitch checked={isChipsInBB} onChange={onIsChipsInBBChange} name={'BB'} label={'BB'} className={classes.switch}/>
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    isChipsInBB: tableWS.isChipsInBB,
  };
};

export default connect(mapStateToProps, {setIsChipsInBB})(BigBlindSwitch)