import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {startInstance, restartInstance} from './../actions'

class Instance extends Component {
  render() {
    const {instance} = this.props
    switch (instance.getIn(['data','status'])) {
      default:
      case 'waiting':
        return (
          <div className="instance">
            <h1>Waiting For Players</h1>
            <button type="button" onClick={startInstance}>Start</button>
          </div>
        )
      case 'started':
        return (
          <div className="instance">
            Game In Progress - Display Dashboard
            <button type="button" onClick={restartInstance}>Restart</button>
          </div>
        )
      case 'stopped':
        return (
          <div className="instance">
            <h1>It's Over</h1>
            <h2>Winner is {instance.getIn(['data','endState','winner','user','name'])}</h2>
            <button type="button" onClick={restartInstance}>Restart</button>
          </div>
        )
    }
  }
}

Instance.contextTypes = {
  store: PropTypes.object.isRequired
}

Instance.propTypes = {
  instance: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    instance: state.instance
  }
}

export default connect(
  mapStateToProps
)(Instance)