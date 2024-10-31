import React from "react";
import {itemIcon} from "./itemStore";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {setCurrentItem, setCurrentProduct} from "../../redux/actions/market";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {Popover} from "@material-ui/core";
import StarIcon from '@material-ui/icons/Star';
import ChipIcon from "../UI/ChipIcon";
import Coin from "../UI/Coin";
import Vip from "../UI/Vip";
import {productIcon} from "./productStore";

const styles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    background: '#172b37',
    position: 'relative',
    '&:hover': {
      cursor: 'pointer',
      background: '#315c76',
    }
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1vw',
    width: '100%',
  },
  infoPlate: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    bottom: '1%',
    width: '96%',
    display: 'flex',
    padding: '0 8px',
    justifyContent: 'space-between',
    whiteSpace: 'pre',
  },
  name: {
    color: 'rgb(255,255,255)',
    fontWeight: 'bold',
  },
  priceChips: {
    color: 'rgb(46, 231, 3)',
  },
  priceIcon: {
    width: '20px',
    height: '20px',
    display: "inline-block"
  },
  priceCoins: {
    color: 'rgb(246,223,18)',
  },
  popover: {
    pointerEvents: 'none',
  },
  specialEffects: {
    color: '#3dd918',
  },
  specialItemIcon: {
    color: '#3dd918',
    position: 'absolute',
    right: '3%',
    top: '3%',
    width: '30px',
    height: '30px',
  },
  vipIcon: {
    position: 'absolute',
    width: '40%'
  }
}))

export const itemCellTypes = Object.freeze({
  ITEM: "ITEM",
  PRODUCT: "PRODUCT"
});

const ItemCell = ({item, type, setCurrentItem, setCurrentProduct}) => {
  const classes = styles()
  const {t} = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const maxNameLength = isPortrait ? 4 : (isMobile ? 9 : 14)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPopover = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    if (item.specialEffects) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const buy = (item) => {
    if (type === itemCellTypes.PRODUCT) {
      setCurrentProduct(item)
    } else {
      setCurrentItem(item)
    }
  }

  const price = () => {
    if (type === itemCellTypes.PRODUCT) {
      return item.Price
    }
    if (type === itemCellTypes.ITEM && item.priceList) {
      return item.priceList.day
    }
  }

  const icon = () => {
    if (type === itemCellTypes.PRODUCT) {
      return productIcon(item.id)
    }
    if (type === itemCellTypes.ITEM) {
      return itemIcon(item.id)
    }
  }

  const priceTag = () => {
    if (item.saleType === "notForSale") {
      return item.note
    }
    if (item.saleType === "coins") {
      return <div className={classes.priceCoins}>{price()} <div className={classes.priceIcon}><Coin/></div></div>
    }
    if (item.saleType === "chips") {
      return <div className={classes.priceChips}>{price()} <ChipIcon className={classes.priceIcon}/></div>
    }
  }

  return (
    <>
      <div
        className={classes.root}
        onClick={() => buy(item)}
        aria-owns={openPopover ? 'item-cell-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {
          item.saleType === "coins" && type === itemCellTypes.ITEM &&
            <div className={classes.vipIcon}><Vip/></div>
        }
        <div className={classes.item}>
          {icon()}
        </div>

        <div className={classes.infoPlate}>
          <span className={classes.name}>
            {t(item.name).length <= maxNameLength ? t(item.name) : t(item.name).substring(0, maxNameLength) + "..."}
          </span>
          {priceTag()}
        </div>

        {
          item.specialEffects &&
          <StarIcon className={classes.specialItemIcon}/>
        }
      </div>

      <Popover
        className={classes.popover}
        id="item-cell-popover"
        open={openPopover}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className={classes.specialEffects}>
          {item.specialEffects && item.specialEffects.map((se, idx) => {
            return <li key={idx}>{t(`${se}`)}</li>
          })}
        </div>
      </Popover>
    </>
  )
}

export default connect(null, {setCurrentItem, setCurrentProduct})(ItemCell)