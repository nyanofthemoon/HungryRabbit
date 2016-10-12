'use strict';

let deepExtend = require('deep-extend')
let MD5 = require('crypto-js/md5')

let Logger = require('./Logger')

const CONFIG = require('./../config')

class User {

  constructor(config) {
    this.logger = new Logger('USER', config)
    this.socket = null
    this.data = {
      name    : CONFIG.user.defaultName,
      image   : null,
      instance: null
    }
  }

  initialize(socket, data) {
    this.socket = socket
    deepExtend(this.data, data)
    if (!this.data.id) {
      this.data.id = User.getId(this.data.name)
    }
  }

  static getId(name) {
    return MD5(name).toString()
  }

  getId() {
    return User.getId(this.data.name)
  }

  getName() {
    return this.data.name
  }

  getInstance() {
    return this.data.instance
  }

  query() {
    var struct = {
      'type': 'user',
      'data': {
        'id'   : this.getId(),
        'name' : this.getName(),
        'image': this.data.image
      }
    }

    return struct
  }

  canJoin(instance) {
    return true
    //@TODO Fix this
    //return !instance.hasUser(this)
  }

  join(instance) {
    let instanceId = instance.getId()
    this.socket.join(instanceId)
    this.data.instance = instanceId
    instance.addUser(this)
    this.socket.emit('query', instance.query())
  }

  canAct(instance) {
    return instance.hasUser(this)
  }

  canLeave(instance) {
    return true
    //@TODO Fix this
    // return instance.hasUser(this)
  }

  leave(instance) {
    let instanceId = instance.getId()
    this.socket.leave(instanceId)
    instance.removeUser(this)
    this.socket.to(instanceId).emit('leave', this.query())
  }

}

module.exports = User