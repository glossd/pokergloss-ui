import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Trail, animated, Spring} from 'react-spring';
import Card from "../Card/Card";
import {subscribeBefore, unsubscribe} from "../../../redux/redux-subscribe-action";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {COMMUNITY_CARDS} from "../../../redux/actions/table";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles} from "@material-ui/core/styles";

const desktopStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    width: '29vw',
  },
  card: {
    margin: '0 2px'
  }
}))

const mobileStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    width: '35vw',
  },
  card: {
    margin: '0 2px'
  }
}))

const CommunityCards = ({communityCards, winningCards}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()

  const [newCommunityCards, setNewCommunityCards] = useState([])
  const [isWinnersTime, setIsWinnersTime] = useState(false)

  useEffect(() => {
    return () => {
      unsubscribe("community-cards")
    }
  }, [])

  subscribeBefore("community-cards", (action) => {
    if (action.type === EventsTableEventTypeEnum.NewBettingRound) {
      // the communityCards hook will be always empty if you pass it here
      const newCards = action.payload.newCards
      setNewCommunityCards(newCards)
    }

    if (action.type === EventsTableEventTypeEnum.NewBettingRound || action.type === COMMUNITY_CARDS) {
      // the communityCards hook will be always empty if you pass it here
      const newCards = action.payload.newCards
      setNewCommunityCards(newCards)
    }

    if (action.type === EventsTableEventTypeEnum.Winners) {
      setNewCommunityCards([])
      setIsWinnersTime(true)
      setTimeout(() => setIsWinnersTime(false), 4000)
    }
  })

  function isOneOfTheBestCard(card) {
    if (winningCards) {
      return (winningCards.indexOf(card) !== -1)
    }
  }

  function oldCommunityCards() {
    return communityCards.filter(c => !newCommunityCards.includes(c))
  }

  if (!communityCards || communityCards.length === 0) {
    return <div/>
  }

  return (
    <div className={classes.root}>
      {oldCommunityCards().map(c => (
        <div key={c} className={classes.card}>
          <Card cardStr={c} size={isMobile?'super-big':'big'} cardFace={'up'} timeToOpen={0}
                isMoveUp={isWinnersTime && isOneOfTheBestCard(c)}
                isShadow={isWinnersTime && !isOneOfTheBestCard(c)}/>
        </div>
      ))}
      <Trail
        native
        reset={true}
        items={
          newCommunityCards.map((c, idx) => ({
            key: c,
            card: <Card cardStr={c} size={isMobile?'super-big':'big'} cardFace={'down'} timeToOpen={500+idx*100}/>
          }))
        }
        keys={item => item.key}
        from={{opacity: 0.5, transform: 'translate3d(0,-150px,0)'}}
        to={{opacity: 1, transform: 'translate3d(0,0px,0)'}}>
        {item => props => <animated.div className={classes.card} style={props} key={item.key}>{item.card}</animated.div>}
      </Trail>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  // return { communityCards: ["Jc", "Qc", "Kc", "Ac", "Jh", "Qh", "Kh", "Ah", "Js", "Qs", "Ks", "As", "Jd", "Qd", "Kd", "Ad"] };
  // return { communityCards: ["4c", "5c", "6h", "7h", "8h", "9h", "Ts", "Jc", "Qs", "Kd", "Ah"] };
  return { communityCards: tableWS.table.communityCards, winningCards: tableWS.winningCards  };
};

export default connect(mapStateToProps)(CommunityCards);