import React from "react";
import SurvivalTicket from "../Lobby/Survival/SurvivalTicket";

const fiveTickets = (className) => <SurvivalTicket className={className}/>

const productMap = new Map([
  ['5tickets', {getIcon: fiveTickets}]
])

export function productExists(itemId) {
  return productMap.has(itemId)
}

export function productIcon(productId, className) {
  const product = productMap.get(productId)
  if (product) {
    return product.getIcon(className)
  }
  return <div/>
}

export function getProduct(productId) {
  const product = productMap.get(productId)
  if (product) {
    return {
      name: "MarketPage.Products."+productId+".Name",
    }
  }
  return {name: ""}
}