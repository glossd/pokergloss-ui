import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";
import {itemIcon} from "../market/itemStore";
import ItemExpiration from "../UI/ItemExpiration/ItemExpiration";
import ItemCellCheckBox from "./ItemCellCheckBox";

const styles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    background: '#172b37',
    position: 'relative',
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
    textAlign: 'center',
    color: 'rgb(255,255,255)',
    fontWeight: 'bold',
  },
  checkBox: {
    position: 'absolute',
    right: 0,
    top: 0,
  }
}))

const InventoryItemCell = ({item}) => {
  const classes = styles()
  const {t} = useTranslation();

  return (
    <div className={classes.root}>

      <div className={classes.item}>
        {itemIcon(item.itemId)}
      </div>

      <div className={classes.infoPlate}>
        {
          item.expiresAt ?
            <ItemExpiration expiresAt={item.expiresAt}/> :
            <div>{t("InventoryPage.Infinity")}</div>
        }
      </div>

      <div className={classes.checkBox}>
        <ItemCellCheckBox item={item}/>
      </div>
    </div>
  )
}

export default InventoryItemCell