import {fromJS} from 'immutable'

import Config     from './../config'
import * as types from './../constant'

const initialState = fromJS({
  state: 'disconnected'
})

const manager = (state = initialState, action) => {
  let actionIsInCurrentReducer = true
  let nextState;
  switch (action.type) {
    case types.CONNECT_SOCKET_REQUESTED:
      nextState = state.set('state', 'connecting')
      break;
    case types.CONNECT_SOCKET_SUCCEEDED:
      nextState = state.set('state', 'connected')
      break;
    case types.CONNECT_SOCKET_FAILED:
      nextState = state.set('state', 'disconnected')
      break;
    default:
      actionIsInCurrentReducer = false
      break;
  }
  if (Config.environment.isVerbose() && actionIsInCurrentReducer) {
    console.log('[Reducer  ] Manager ' + action.type)
  }
  return nextState || state
}

export default manager