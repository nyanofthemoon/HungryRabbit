import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

let _ = require('lodash')

import {startInstance, restartInstance} from './../actions'

class Instance extends Component {

  _getUser(id) {
    return this.props.instance.getIn(['data','users', id])
  }

  _getOrderedTaps() {
    let data = _.mapValues(this.props.instance.getIn(['data', 'state']).toJSON(),parseInt)
    let taps = []
    let that = this
    Object.keys(data).forEach(function(key) {
      let user = that._getUser(key)
      taps.push({id: user.get('name'), data: data[key]})
    })
    return taps.slice(0, 10)
  }

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
            <div className="dashboard">
              {this._getOrderedTaps().map(function(tap) {
                return (<div key={tap.name} className="board">
                  <div className="board-id">{tap.id}</div>
                  <div className="board-data">{tap.data}</div>
                </div>)
              })}
            </div>
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