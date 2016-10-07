import * as _ from 'lodash'

import Store      from './store'
import {createSocketConnection, emitSocketInstanceQueryEvent, emitSocketInstanceUpdateEvent} from './helpers/socket'
import Config     from './config'
import * as types from './constant'

let socket
let dispatch = Store.dispatch

let queryInterval

function _getState() {
  return Store.getState()
}

export function connectSocket() {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.CONNECT_SOCKET_REQUESTED)
  }
  socket   = createSocketConnection('password')
  socket.on('error', function (error) {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Error', error)
    }
    connectSocketFailure()
  })
  socket.on('connect', function () {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Connect')
    }
    connectSocketSuccess()
  })
  return {type: types.CONNECT_SOCKET_REQUESTED}
}

function connectSocketSuccess() {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.CONNECT_SOCKET_SUCCEEDED)
  }
  dispatch({type: types.CONNECT_SOCKET_SUCCEEDED})
  socket.on('query', function (data) {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Query', data)
    }
    switch (data.type) {
      case 'instance':
        return queryInstanceReception(data)
      default:
        return queryUnknownReception(data)
    }
  })
  dispatch({type: types.UPDATE_INSTANCE_REQUESTED})
  emitSocketInstanceUpdateEvent(Config.instance.id, {})
  bindWindowResizeEvent()
  window.dispatchEvent(new Event('resize'))
}

function connectSocketFailure(message) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.CONNECT_SOCKET_FAILED)
  }
  dispatch({type: types.CONNECT_SOCKET_FAILED})
}


export function restartInstance() {
  if (queryInterval) {
    clearInterval(queryInterval)
  }
  emitSocketInstanceUpdateEvent(Config.instance.id, {
    status  : 'waiting',
    users   : {},
    state   : {}
  })
}

export function startInstance() {
  if (queryInterval) {
    clearInterval(queryInterval)
  }
  emitSocketInstanceUpdateEvent(Config.instance.id, {
    status: 'started'
  })
  queryInterval = setInterval(function() {
    emitSocketInstanceQueryEvent(Config.instance.id)
  }, 250)
}

export function stopInstance() {
  emitSocketInstanceUpdateEvent(Config.instance.id, {
    status: 'stopped'
  })
  clearInterval(queryInterval)
}

export function queryInstance() {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.QUERY_INSTANCE_REQUESTED)
  }
  emitSocketInstanceQueryEvent(Config.instance.id)
  return {type: types.QUERY_INSTANCE_REQUESTED, payload: {id: Config.instance.id}}
}

function queryInstanceReception(data) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.QUERY_INSTANCE_RECEIVED)
  }
  if ('stopped' === data.data.status) {
    clearInterval(queryInterval)
  }
  dispatch({type: types.QUERY_INSTANCE_RECEIVED, payload: data.data})
}

function queryUnknownReception(data) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.QUERY_UNKNOWN_RECEIVED)
  }
  dispatch({type: types.QUERY_UNKNOWN_RECEIVED, payload: data})
}

function bindWindowResizeEvent() {
  window.addEventListener('resize', _.debounce(function (e) {
    if (Config.environment.isVerbose()) {
      console.log('[Action   ] Run ' + types.WINDOW_RESIZE_EVENT_RECEIVED)
    }
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    dispatch({type: types.WINDOW_RESIZE_EVENT_RECEIVED, payload: {width: width, height: height}})
  }, Config.debounce.windowResize.interval, Config.debounce.windowResize.options))
}