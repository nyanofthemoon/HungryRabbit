'use strict';

let deepExtend = require('deep-extend')
let _ = require('lodash')

let CONFIG = require('./../config')
let Logger = require('./Logger')

const CLIENT_INSTANCE_STATUS_WAIT  = 'waiting'
const CLIENT_INSTANCE_STATUS_START = 'started'
const CLIENT_INSTANCE_STATUS_STOP  = 'stopped'

class ClientInstance {

  constructor(config) {
    this.logger = new Logger('CLIENT INSTANCE', config)
    this.socket = null
    this.data = {
      id       : null,
      type     : null,
      status   : null,
      users    : {},
      state    : {},
      condition: 0,
      endState : {}
    }
  }

  initialize(socket, data) {
    this.socket = socket
    deepExtend(this.data, data)
    switch(data.type) {
      case 'tap':
        this.data.condition = CONFIG.tapConfig.maxTaps
        break
      default: break
    }
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

  isAcceptingJoins() {
    return (CLIENT_INSTANCE_STATUS_WAIT === this.data.status)
  }

  isAcceptingActions() {
    return (CLIENT_INSTANCE_STATUS_START === this.data.status)
  }

  query() {
    let struct = {
      type: 'instance',
      data: this.data
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
    this.data.users[user.getId()] = user.query().data
    switch (this.data.type) {
      case 'tap':
        this._tap(user, 0)
        break
      default:
        break
    }
  }

  // Actions

  act(data, user) {
    switch (data.type) {
      case 'tap':
        this._tap(user, parseInt(data.data))
        break
      default:
        break
    }
    return this.over(data)
  }

  over(data) {
    switch (data.type) {
      case 'tap':
        let tapOver = this._tapReached()
        if (true === tapOver) {
          this.stop()
          this.data.endState = this._tapEndState()
          this.socket.to(this.getId()).emit('query', this.query())
        }
        return tapOver
        break
      default:
        break
    }
  }

  _tap(user, value) {
    if (!this.data.state[user.getId()]) {
      this.data.state[user.getId()] = 0
    }
    this.data.state[user.getId()] = this.data.state[user.getId()] + value
  }

  _highestStateKey() {
    let that = this
    let data = _.take(Object.keys(this.data.state).map(function(key) {
      return {id: key, data: that.data.state[key]}
    }).sort(function(a, b) {
      return b.data - a.data
    }), 1)
    return data[0].id || null
  }

  _tapReached() {
    let highest = this._highestStateKey()
    return (this.data.state[highest] >= this.data.condition)
  }

  _tapEndState() {
    let highest = this._highestStateKey()
    return {
      winner: {
        id  : highest,
        user: this.data.users[highest]
      }
    }
  }

}

module.exports = ClientInstance