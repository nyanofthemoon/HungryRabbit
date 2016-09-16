import React, {Component, PropTypes} from 'react'

import Instance from './Instance'

import {connectSocket} from './../actions'

class Application extends Component {

  componentWillMount() {
    connectSocket()
  }

  render() {
     return (
       <div className="flex-horizontal-container light-text">
         <Instance />
       </div>
     )
  }
}

Application.contextTypes = {
  store: PropTypes.object.isRequired
}

export default Application