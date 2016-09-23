'use strict';

let deepExtend = require('deep-extend')
let _ = require('lodash')

let Logger = require('./Logger')

const CLIENT_INSTANCE_STATUS_WAIT  = 'waiting'
const CLIENT_INSTANCE_STATUS_START = 'started'
const CLIENT_INSTANCE_STATUS_STOP  = 'stopped'

class ClientInstance {

  constructor(config) {
    this.logger = new Logger('CLIENT INSTANCE', config)
    this.socket = null
    this.data = {
      id: null,
      status: null,
      users: {},
      taps: {},
      maxTaps: 0
    }
  }

  initialize(socket, data) {
    this.socket = socket
    deepExtend(this.data, data)
  }

  getId() {
    return this.data.id
  }

  getStatus() {
    return this.data.status
  }

  wait() {
    this.data.status = CLIENT_INSTANCE_STATUS_WAIT
  }

  start() {
    this.data.status = CLIENT_INSTANCE_STATUS_START
  }

  stop() {
    this.data.status = CLIENT_INSTANCE_STATUS_STOP
  }

  isAcceptingJoin() {
    return (CLIENT_INSTANCE_STATUS_WAIT === this.data.state)
  }

  query() {
    let that  = this
    let users = []
    Object.keys(this.getUsers()).map(function(user, index) {
      users.push(that.data.users[user].query().data)
    })
    let struct = {
      type: 'instance',
      data: {
        id    : this.getId(),
        status: this.getStatus(),
        users : users,
        taps  : this.data.taps
      }
    }

    return struct
  }

  getUsers() {
    return this.data.users
  }

  hasUser(user) {
     if (!this.data.users[user.getId()]) {
       return false
     }

    return true
  }

  removeUser(user) {
    delete this.data.users[user.getId()]
  }

  addUser(user) {
    this.data.users[user.getId()] = user
  }

  // Actions

  act(type, user) {
    if (CLIENT_INSTANCE_STATUS_START === this.getStatus()) {
      switch (type) {
        case 'tap':
          this._tap(user, 1)
          break
        default:
          break
      }
    }
  }

  _tap(user, value) {
    this.data.taps[user.getId()] = this.data.taps[user.getId()] + value
  }

  _tapReached() {
    let highest = _.max(Object.keys(this.data.taps), function (o) {
      return this.data.taps[o]
    })
    return (highest >= this.data.maxTaps)
  }

}

module.exports = ClientInstance