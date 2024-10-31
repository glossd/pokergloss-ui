const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  async redirects() {
    return [
      {
        source: '/lobby',
        destination: '/lobby/live',
        permanent: false,
      },
      {
        source: '/lobby/ring',
        destination: '/lobby/live',
        permanent: true,
      },
      {
        source: '/market',
        destination: '/market/items',
        permanent: false,
      },
      {
        source: '/survival',
        destination: '/lobby/survival',
        permanent: false,
      },
      {
        source: '/subbota',
        destination: '/ru/lobby/multi/5fea7180df0ccde21ef5e2c0',
        permanent: false,
      },
      {
        source: '/daily-20',
        destination: '/lobby/multi',
        permanent: false,
      },
    ]
  },
}