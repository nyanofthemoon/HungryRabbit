import React, {Component, PropTypes} from 'react'

import ClientManager from './ClientManager'

class Application extends Component {
  render() {
     return (
       <div className="flex-vertical-container light-text">
         <ClientManager />
       </div>
     )
  }
}

Application.contextTypes = {
  store: PropTypes.object.isRequired
}

export default Application