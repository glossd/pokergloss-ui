
export function validateUsername(username) {
  if (username.length < 3) {
    return "min length is 3 letters"
  }
  if (username.length > 13) {
    return "max length is 13 letters"
  }
  if (username.includes('__')) {
    return 'username can\'t have multiple "_" underscores in a row'
  }
  if (username.indexOf('_') === 0) {
    return 'username can\'t start with "_" underscore'
  }
  if (username.endsWith('_')) {
    return 'username can\'t end with "_" underscore'
  }
  if (!(/^[A-Za-z0-9_]+$/.test(String(username)))) {
    return "must contain latin letters, digits and \"_\" character"
  }

  return ""
}