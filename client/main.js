'use strict'

let express    = require('express')
var bodyParser = require('body-parser')
let auth       = require('http-auth')

const CONFIG = require('./config')
let logger   = new (require('./../server/modules/Logger'))('SERVER [WEB]', CONFIG)

let options = {
  dotfiles  : 'ignore',
  etag      : false,
  extensions: ['htm', 'html'],
  index     : 'index.html',
  maxAge    : '1d',
  redirect  : false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

var basic = auth.basic({
    realm: 'Admin Panel',
    msg401: 'Client Authentication Required',
    msg407: 'Proxy Authentication Required ',
    skipUser: true
  }, function (username, password, next) {
    next(username === CONFIG.admin.username && password === CONFIG.admin.password)
  }
)

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/player/assets', express.static('client/player/assets', options));
app.use('/admin/assets',  express.static('client/admin/assets', options));

app.use('/admin', auth.connect(basic))
app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/admin/index.html')
})

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/player/index.html')
})

module.exports = {
  app   : app,
  logger: logger
}