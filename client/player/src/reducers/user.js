import {fromJS} from 'immutable'

import Config     from './../config'
import * as types from './../constant'

const initialState = fromJS({
  data: {
    id      : null,
    name    : 'Unnamed',
    image   : null,
    instance: null
  }
})

const user = (state = initialState, action) => {
  let actionIsInCurrentReducer = true
  let newState
  switch (action.type) {
    case types.QUERY_USER_RECEIVED:
      newState = state.set('data', fromJS(action.payload))
      break
    default:
      actionIsInCurrentReducer = false
      break
  }
  if (Config.environment.isVerbose() && actionIsInCurrentReducer) {
    console.log('[Reducer  ] User ' + action.type)
  }
  return newState || state
}

export default user