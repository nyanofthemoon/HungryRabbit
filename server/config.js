'use strict'

let environment = process.env.NODE_ENV || 'development'

module.exports = {

  environment: {
    port:    process.env.PORT    || 8888,
    verbose: process.env.VERBOSE || true,
    isDevelopment: function() {
        return ('development' === environment)
    }
  },

  instance: {
    defaultType: 'tap'
  },

  tapConfig: {
    maxTaps: 10
  },

  user: {
    defaultName: 'Unnamed'
  }

}