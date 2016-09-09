'use strict'

let environment = process.env.NODE_ENV || 'development'

module.exports = {

  environment: {
    host         : process.env.HOSTNAME   || 'localhost',
    port         : process.env.PORT       || 8000,
    verbose      : process.env.VERBOSE    || true,
    isDevelopment: function() {
      return ('development' === environment)
    }
  },

  admin: {
    username: 'nyan',
    password: 'nyan'
  }

}