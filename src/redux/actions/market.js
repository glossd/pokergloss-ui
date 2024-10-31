export const SET_CURRENT_ITEM = 'SET_CURRENT_ITEM'
export const SET_CURRENT_PRODUCT = 'SET_CURRENT_PRODUCT'
export const CLEAR_MARKET = 'CLEAR_MARKET'

export const setCurrentItem = (currentItem) => ({
  type: SET_CURRENT_ITEM,
  currentItem
})

export const setCurrentProduct = (currentProduct) => ({
  type: SET_CURRENT_PRODUCT,
  currentProduct
})

export const clearMarket = () => ({
  type: CLEAR_MARKET
})