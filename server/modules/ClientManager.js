'use strict'

var sanitizer = require('sanitizer')

let Logger         = require('./Logger')
let ClientInstance = require('./ClientInstance')
let User           = require('./User')

class ClientManager {

  constructor(config) {
    this.logger = new Logger('CLIENT MANAGER', config)
    this.config = config
    this.sockets = null
    this.data = {
      sessions: {},
      users: {},
      instances: {},
      admin: {}
    }
  }

  addUser(user) {
    this.data.users[user.getId()] = user
  }

  removeUser(user) {
    delete(this.data.users[user.getId()])
  }

  getUserById(id) {
    return this.data.users[id]
  }

  getUser(sessionIdentifier) {
    return this.data.users[sessionIdentifier] || null
  }

  getUsers() {
    return this.data.users || {}
  }

  addClientInstance(id, data) {
    this.data.instances[id] = data
  }

  getClientInstance(id) {
    return this.data.instances[id] || null
  }

  getClientInstances() {
    return this.data.instances || {}
  }

  static initialize(io, config) {
    return new Promise(function (resolve, reject) {
      try {
        let game = new ClientManager(config)
        game.sockets = io
        resolve(game)
      } catch (e) {
        reject()
      }
    })
  }

  getUserBySocketId(id) {
    return this.data.users[this.data.sessions[id]]
  }

  bindSocketToModuleEvents(socket) {
    var that = this
    try {
      socket.on('error', function (data) {
        that.error(data, socket)
      })
      socket.on('query', function (data) {
        that.query(data, socket)
      })
      socket.on('join', function (data) {
        that.join(data, socket)
      })
      socket.on('action', function (data) {
        that.action(data, socket)
      })
      socket.on('leave', function (data) {
        that.leave(data, socket)
      })
    } catch (e) {
      this.logger.error('Socket ' + socket.id + ' not bound to user events ', e)
    }
  }

  bindSocketToAdminModuleEvents(socket) {
    var that = this
    try {
      socket.on('error', function (data) {
        that.error(data, socket)
      })
      socket.on('query', function (data) {
        that.query(data, socket)
      })
      socket.on('update', function (data) {
        that.update(data, socket)
      })
    } catch (e) {
      this.logger.error('Socket ' + socket.id + ' not bound to admin events ', e)
    }
  }

  join(data, socket) {
    try {
      var instance = this.getClientInstance(data.id)
      if (instance) {
        if (instance.isAcceptingJoins()) {
          let user = this.getUserBySocketId(socket.id)
          if (user.canJoin(instance)) {
            let joinedInstance = this.getClientInstance(user.getInstance())
            if (joinedInstance && user.canLeave(joinedInstance)) {
              user.leave(joinedInstance)
            }
            user.join(instance)
            if (this.data.admin.socket) {
              this.data.admin.socket.emit('query', instance.query())
            }
            this.logger.verbose('[JOIN] ' + JSON.stringify(data))
          } else {
            this.logger.verbose('[JOIN] Invalid ' + JSON.stringify(data))
          }
        } else {
          this.logger.verbose('[JOIN] Instance not accepting user joins')
        }
      } else {
        this.logger.verbose('[JOIN] Instance ' + data.id + ' not available')
      }
    } catch (e) {
      this.logger.error('[JOIN] ' + JSON.stringify(data) + ' ' + e)
    }
  }

  action(data, socket) {
    try {
      let user           = this.getUserBySocketId(socket.id)
      let joinedInstance = this.getClientInstance(user.getInstance())
      if (joinedInstance && true === joinedInstance.isAcceptingActions() && user.canAct(joinedInstance)) {
        let over = joinedInstance.act(data, user)
        if (true == over) {
          let users = joinedInstance.getUsers()
          let that = this
          Object.keys(users).forEach(function(id) {
            let iuser = that.getUserById(id)
            joinedInstance.removeUser(iuser)
            if (iuser.socket) {
              iuser.socket.leave(joinedInstance.getId())
              iuser.socket.disconnect(true)
            }
          })
          this.logger.info('[ACTION] ' + user.getId() + ' won the game')
        } else {
          this.logger.verbose('[ACTION] ' + user.getId() + ' ' + JSON.stringify(data))
        }
      }
    } catch (e) {
      this.logger.error('[ACTION] ' + JSON.stringify(data) + ' ' + e)
    }
  }

  leave(data, socket) {
    try {
      let user = this.getUserBySocketId(socket.id)
      let instance = this.getClientInstance(data.id)
      if (instance && user.canLeave(instance)) {
        user.leave(instance)
        if (this.data.admin.socket) {
          this.data.admin.socket.emit('query', instance.query())
        }
        this.logger.verbose('[LEAVE] ' + JSON.stringify(data))
      } else {
        this.logger.verbose('[LEAVE] Invalid ' + JSON.stringify(data))
      }
    } catch (e) {
      this.logger.error('[LEAVE] ' + JSON.stringify(data), e)
    }
  }

  query(data, socket) {
    try {
      let info = null
      switch (data.type) {
        case 'instance':
          info = this.data.instances[data.id].query()
          break
        case 'user':
          info = this.getUserBySocketId(socket.id).query()
          break
        default:
          break
      }
      socket.emit('query', info)
      this.logger.verbose('[QUERY] ' + data.type)
    } catch (e) {
      this.logger.error('[QUERY] ' + JSON.stringify(info) + ' ' + e)
    }
  }

  update(data, socket) {
    try {
      let info = null
      switch (data.type) {
        case 'instance':
          let instance = this.data.instances[data.id]
          if (!instance) {
            instance = new ClientInstance(this.config)
            instance.initialize(this.sockets, { id: data.id, type: this.config.instance.defaultType })
            instance.wait()
            this.addClientInstance(data.id, instance)
          } else {
            data.data.type = this.config.instance.defaultType
            instance.initialize(this.sockets, data.data)
          }
          info = instance.query()
          socket.emit('query', info)
          socket.to(instance.getId()).emit('query', info)
          break
        default:
          break
      }
      this.logger.verbose('[UPDATE] ' + data.type)
    } catch (e) {
      this.logger.error('[UPDATE] ' + JSON.stringify(info) + ' ' + e)
    }
  }

  error(data, socket) {
    try {
      socket.emit('error', {event: 'error'})
    } catch (e) {
      this.logger.error('An unknown socket error has occured', e)
    }
  }

  handleSocketConnection(socket) {
    if (socket.handshake.query.name) {
      let userName     = socket.handshake.query.name
      let nameInstance = 1
      let userId       = User.getId(userName)
      let user         = this.getUser(userId)
      while (user !== null) {
        userName = socket.handshake.query.name + ' ' + nameInstance
        userId   = User.getId(userName)
        user     = this.getUser(userId)
        nameInstance++
      }
      user = new User(this.config)
      user.initialize(socket, {
        name: userName
      })
      this.addUser(user)
      this.data.sessions[socket.id] = User.getId(userName)
      this.bindSocketToModuleEvents(socket)
      this.logger.info('User ' + user.getName() + ' connected.', socket.id)
    } else if (socket.handshake.query.admin) {
      this.logger.info('Admin connected.', socket.id)
      this.data.admin = {
        socket: socket
      }
      this.bindSocketToAdminModuleEvents(socket)
    }
  }

  handleSocketDisconnection(socket) {
    let socketId = socket.id
    let user     = this.getUserBySocketId(socketId)
    if (user) {
      delete(this.data.sessions[socketId])
      let userInstanceId = user.getInstance()
      if (userInstanceId) {
        let instance = this.getClientInstance(userInstanceId)
        if (instance && user.canLeave(instance)) {
          user.leave(instance)
        }
      }
      this.removeUser(user)
      this.logger.info('User ' + user.getName() + ' disconnected from ' + userInstanceId + '.', socket.id)
    } else if (this.data.admin.socket && socketId == this.data.admin.socket.id) {
      this.logger.info('Admin disconnected.', socket.id)
    }
  }

}

module.exports = ClientManager