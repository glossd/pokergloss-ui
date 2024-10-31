export const SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED'
export const SET_IS_EMAIL_VERIFIED = 'SET_IS_EMAIL_VERIFIED'
export const SET_IS_ANONYMOUS = 'SET_IS_ANONYMOUS  '
export const LOG_OUT = 'LOG_OUT'

export const evictLogOut = () => ({
  type: LOG_OUT
})

export const setIsAuthenticated = (isAuthenticated) => ({
  type: SET_IS_AUTHENTICATED,
  isAuthenticated
})

export const setIsEmailVerified = (isEmailVerified) => ({
  type: SET_IS_EMAIL_VERIFIED,
  isEmailVerified
})

export const setIsAnonymous = (isAnonymous) => ({
  type: SET_IS_ANONYMOUS,
  isAnonymous
})