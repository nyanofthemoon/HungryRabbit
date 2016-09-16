'use strict';

import io from 'socket.io-client'

import Config     from './../config'
import * as types from './../constant'

let socket

export function createSocketConnection(value) {
  if (Config.environment.isVerbose()) {
    console.log('[WebSocket] Emit Connection for admin')
  }
  socket = io.connect('//' + Config.environment.host + Config.environment.port, {"query": {"admin": value}})
  return socket
}

export function emitSocketInstanceQueryEvent(id) {
  if (Config.environment.isVerbose()) {
    console.log('[WebSocket] Emit Instance Query for ' + id)
  }
  socket.emit('query', {type: 'instance', id: id})
}

export function emitSocketInstanceUpdateEvent(id, data) {
  if (Config.environment.isVerbose()) {
    console.log('[WebSocket] Emit Instance Update for ' + id)
  }
  socket.emit('update', {type: 'instance', id: id, data: data})
}