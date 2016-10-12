import * as _   from 'lodash';
import {fromJS} from 'immutable'

import Config     from './../config'
import * as types from './../constant'

const initialState = fromJS({
  state: 'unjoined',
  data: {
    id    : null,
    status: null,
    users : {}
  }
})

const instance = (state = initialState, action) => {
  let actionIsInCurrentReducer = true
  let nextState
  switch (action.type) {
    case types.QUERY_INSTANCE_RECEIVED:
      nextState = state.merge({
        state: 'joined',
        data : fromJS(action.payload)
      })
      break
    default:
      actionIsInCurrentReducer = false
      break
  }
  if (Config.environment.isVerbose() && actionIsInCurrentReducer) {
    console.log('[Reducer  ] Instance ' + action.type)
  }
  return nextState || state
}

export default instance