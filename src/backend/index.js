
export function errorMessage(e) {
  let defaultMsg = 'Something went wrong';
  if (!e) {
    return defaultMsg
  }
  if (e.response && e.response.data && e.response.data.message) {
    return e.response.data.message
  }
  if (e.message) {
    return e.message
  }
  return defaultMsg
}

let host = "https://api.pokergloss.com"
if (process.env.NEXT_PUBLIC_USE_PROXY) {
  host = "http://localhost:9999"
}
if (process.env.NEXT_PUBLIC_DEV) {
  host = "https://uat.pokergloss.com"
}
if (process.env.NEXT_PUBLIC_CORS) {
  host = "http://192.168.1.67:6969"
}

export function getBasePath(service) {
  if (host) {
    return `${host}/api/${service}`
  }
  return undefined
}
