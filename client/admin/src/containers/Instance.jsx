import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {startInstance} from './../actions'

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
          </div>
        )
      case 'stoppped':
        return (
          <div className="instance">
            <h1>It's Over</h1>
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