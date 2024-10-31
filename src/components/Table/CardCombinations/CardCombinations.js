import React from "react";

import {IconButton, Popover} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "../Card/Card";
import {useTranslation} from "next-i18next";

const useStyles = makeStyles(() => ({
  userListButton: {
    padding: '5px',
  },
  popover: {
    pointerEvents: 'none',
  },
}));

const CardCombinations = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const highCard = ['Qs', "Jc", "3d", "5h", "8d"]
  const onePair = ['Ad', "Ah", "6d", "7s", "Js"]
  const twoPair = ['Ad', "Ah", "5s", "5c", "3h"]
  const threeOfAKind = ['8d', "8s", "8c", "6d", "Ks"]
  const straight = ['7h', "8c", "9d", "Td", "Jc"]
  const flush = ['Ac', "Jc", "7c", "4c", "2c"]
  const fullHouse = ['8s', "8c", "Ad", "Ah", "Ac"]
  const fourOfAKind = ['5d', "5h", "5s", "5c", "Js"]
  const straightFlush = ["9s", 'Ts', "Js", "Qs", "Ks"]

  function pokerCombination(cards, shadowCardsNumber, combinationName, combinationNumber) {
    return (
      <div className='card-combination-container'>
        <div className='card-combination'>
          <div className='combination-number'>
            {combinationNumber}
          </div>
          {
            cards.map((card, index) => {
              return (
                <div key={`${combinationName}-${index}`} className='card-combination-card'>
                  <Card cardStr={card} cardFace='up' size='little'
                        isShadow={index >= (cards.length - shadowCardsNumber)}/>
                </div>
              )
            })
          }
        </div>
        <div className='combination-name'>
          {combinationName}
        </div>
      </div>
    )
  }

  return (
    <div>
      <IconButton
        aria-describedby={id}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        className={classes.userListButton}
        onMouseOver={handleClick}
        onMouseLeave={handleClose}
      >
        <img className='two-cards-icon' src="https://storage.googleapis.com/pokerblow/poker-table/two-cards-icon.png"
             alt="two-cards-icon"/>
      </IconButton>
      <Popover
        id={id}
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className='card-combinations-popover'>
          <div>
            {pokerCombination(straightFlush, 0, t("table.HandName.Straight Flush"), 1)}
            {pokerCombination(fourOfAKind, 1, t("table.HandName.Four of a Kind"), 2)}
            {pokerCombination(fullHouse, 0, t("table.HandName.Full House"), 3)}
            {pokerCombination(flush, 0, t("table.HandName.Flush"), 4)}
            {pokerCombination(straight, 0, t("table.HandName.Straight"), 5)}
          </div>
          <div>
            {pokerCombination(threeOfAKind, 2, t("table.HandName.Three of a Kind"), 6)}
            {pokerCombination(twoPair, 1, t("table.HandName.Two Pair"), 7)}
            {pokerCombination(onePair, 3, t("table.HandName.Pair"), 8)}
            {pokerCombination(highCard, 4, t("table.HandName.High Card"), 9)}
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default CardCombinations