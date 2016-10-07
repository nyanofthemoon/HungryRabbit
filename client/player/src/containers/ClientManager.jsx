import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import ConnectionForm from './../components/ConnectionForm'
import ClientInstance from './ClientInstance'

import {connectSocket} from './../actions'

class ClientManager extends Component {
  render() {
    const {manager, actions} = this.props
    switch (manager.get('state')) {
      default:
      case 'connecting':
      case 'disconnected':
        return (<div className="light-text text-centered">
          <h1 className="title">Your Name?</h1>
          <ConnectionForm handleSubmit={actions.connectSocket}/>
        </div>)
      case 'connected':
        return (<div className="light-text text-centered">
          <ClientInstance/>
        </div>)
    }
  }
}

ClientManager.propTypes = {
  manager: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    manager: state.manager
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      connectSocket
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientManager)