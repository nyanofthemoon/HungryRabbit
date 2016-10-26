let host    = window.location.hostname
let name    = 'production'
let port    = ''
let verbose = false
let wait    = 45

if (['localhost', '127.0.0.1'].indexOf(host) > -1) {
  name    = 'development'
  port    = ':8888'
  verbose = true
  wait    = 5
}

export default {
  environment: {
    name: name,
    host: host,
    port: port,
    isDevelopment: function () {
      return 'development' === name
    },
    isVerbose: function () {
      return true === verbose
    }
  },
  debounce: {
    windowResize: {
      interval: 500,
      options: {
        leading: false
      }
    }
  },
  instance: {
    id        : 'default',
    listMax   : 7,
    minPlayers: 1,
    joinTimer : wait // seconds
  }
}