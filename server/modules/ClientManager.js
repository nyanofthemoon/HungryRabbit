'use strict';

var sanitizer = require('sanitizer');

let Logger         = require('./Logger');
let ClientInstance = require('./ClientInstance');
let User           = require('./User');

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
    };
  }

  addUser(user) {
    this.data.users[user.getId()] = user
  };

  getUser(sessionIdentifier) {
    return this.data.users[sessionIdentifier] || null
  };

  getUsers() {
    return this.data.users || {}
  };

  addClientInstance(id, data) {
    this.data.instances[id] = data
  };

  getClientInstance(id) {
    return this.data.instances[id] || null
  };

  getClientInstances() {
    return this.data.instances || {}
  };

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
      });
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
    var that = this;
    try {
      socket.on('error', function (data) {
        that.error(data, socket);
      });
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
        if (instance.acceptsJoins()) {
          let user = this.getUserBySocketId(socket.id)
          if (user.canJoin(instance)) {
            let joinedInstance = this.getClientInstance(user.getInstance())
            if (joinedInstance && user.canLeave(joinedInstance)) {
              user.leave(joinedInstance)
            }
            user.join(instance)
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
      if (joinedInstance && user.canAct(joinedInstance)) {
        joinedInstance.act(data.type, user)
      }
      this.logger.verbose('[ACTION] ' + user.getId() + ' ' + JSON.stringify(data))
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
            instance.initialize(this.sockets, { id: data.id })
            instance.wait()
            this.addClientInstance(data.id, instance)
          } else {
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
      let userId = User.getId(socket.handshake.query.name)
      let user   = this.getUser(userId)
      if (!user) {
        user = new User(this.config)
        user.initialize(socket, {
          name: socket.handshake.query.name
        })
        this.addUser(user)
      }
      this.data.sessions[socket.id] = userId
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
      this.logger.info('User ' + user.getName() + ' disconnected from ' + userInstanceId + '.', socket.id)
    } else if (this.data.admin.socket && socketId == this.data.admin.socket.id) {
      this.logger.info('Admin disconnected.', socket.id)
    }
  }

}

module.exports = ClientManager