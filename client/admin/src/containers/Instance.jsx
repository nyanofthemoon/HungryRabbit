let _ = require('lodash')
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {startInstance, restartInstance} from './../actions'
import List from '../components/List'

import Config from './../config'

class Instance extends Component {

  render() {
    const {instance} = this.props
    switch (instance.getIn(['data','status'])) {
      default:
      case 'waiting':
        return (
          <div className="instance">
            <h1 className="title">It's Time To Join</h1>
            <h2 className="title">{Object.keys(this.props.instance.getIn(['data', 'users']).toJSON()).length} Players</h2>
            <button type="button" onClick={startInstance}>Start</button>
          </div>
        )
      case 'started':
        return (
          <div className="instance">
            <List max={Config.instance.listMax} data={this.props.instance.get('data')}/>
            <button type="button" onClick={restartInstance}>Restart</button>
          </div>
        )
      case 'stopped':
        return (
          <div className="instance">
            <h1 className="title">It's Over</h1>
            <h2 className="title">Winner is {instance.getIn(['data','endState','winner','user','name'])}</h2>
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