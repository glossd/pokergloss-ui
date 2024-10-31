import React from "react";
import DefaultCheckBox from "../UI/DefaultCheckBox/DefaultCheckBox";
import {selectItem} from "../../backend/market";
import {backendError} from "../../backend/error";
import {connect} from "react-redux";
import {setSelectedItemId} from "../../redux/actions/inventory";

const ItemCellCheckBox = ({item, selectedItemId, setSelectedItemId}) => {

  const handleChangeSelectedItem = (event, itemId) => {
    selectItem(itemId)
      .then(() => setSelectedItemId(itemId))
      .catch(backendError)
  }

  return (
    <DefaultCheckBox
      checked={item.itemId === selectedItemId}
      onChange={(event) => handleChangeSelectedItem(event, item.itemId)}
    />
  )
}

function mapStateToProps(state) {
  return {
    selectedItemId: state.inventory.selectedItemId
  }
}

export default connect(mapStateToProps, {setSelectedItemId})(ItemCellCheckBox)