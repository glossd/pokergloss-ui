import {getRatingPage} from "../../backend/bank";
import {backendError} from "../../backend/error";

export const REQUEST_TOP_RATINGS = 'REQUEST_TOP_RATINGS'
export const RECEIVE_TOP_RATINGS = 'RECEIVE_TOP_RATINGS'

export async function fetchTopRatings(dispatch) {
  dispatch(requestTopRatings());
  const page = await getRatingPage(10, 1)
    .catch(backendError)
  if (page) {
    dispatch(receiveTopRatings(page.ratings))
  } else {
    dispatch(receiveTopRatings([]))
  }
}

function requestTopRatings() {
  return {
    type: REQUEST_TOP_RATINGS
  }
}

function receiveTopRatings(ratings) {
  return {
    type: RECEIVE_TOP_RATINGS,
    ratings
  }
}