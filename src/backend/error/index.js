import {DefaultApi} from "@pokergloss/browser-logs-client-typescript";
import {forceRefreshIdToken} from "../../auth/Firebase";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("browser-logs"));

export function backendError(error) {
  if (!error) {
    return ""
  }
  let returnMsg = "Something went wrong"
  let jsonError
  if (error.response && error.response.config) {
    if (error.response.status === 403) {
      forceRefreshIdToken()
    }
    let responseError = {
      method: error.response.config.method,
      url: error.response.config.url,
      status: error.response.status,
    }

    if (error.response.data) {
      if (error.response.data.message) {
        responseError.message = error.response.data.message
        returnMsg = error.response.data.message
      } else {
        responseError.data = error.response.data
      }
    }
    jsonError = responseError
  } else if (error.message) {
    jsonError = {
      message: error.message,
      error: JSON.stringify(error)
    }
    returnMsg = error.message
  } else {
    jsonError = {
      error: JSON.stringify(error)
    }
  }
  console.error(jsonError)
  api.postError(jsonError)
  return returnMsg
}