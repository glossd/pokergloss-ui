
const subscribersBefore = new Map()
const subscribersAfter = new Map()

export const subscribeBefore = (key, listener) => {
  subscribersBefore.set(key, listener)
};

export const subscribeAfter = (key, listener) => {
  subscribersAfter.set(key, listener)
};

export const unsubscribe = (key) => {
  subscribersBefore.delete(key)
  subscribersAfter.delete(key)
}

export const deleteAllSubscribers = () => {
  subscribersBefore.clear()
  subscribersAfter.clear()
}

const subscribeActionMiddleware = (api) => (next) => (action) => {
  subscribersBefore.forEach(callback => callback(action))
  const result = next(action);
  subscribersAfter.forEach(callback => callback(action))
  return result
};

export default subscribeActionMiddleware;