let _ = require('lodash')
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {startInstance, restartInstance} from './../actions'
import List from '../components/List'

import Config from './../config'

class Instance extends Component {

  constructor(props) {
    super(props)
    this.state = {
      remaining: null,
      interval : null
    }
  }

  componentWillUnmount() {
    this._clearInterval()
  }

  _startTimer() {
    let that = this
    this.setState({
      remaining: ((Config.instance.joinTimer * 1000) + 1),
      interval : setInterval(function() {
        that._update()
      }, 1000)
    })
  }

  _restartTimer() {
    restartInstance()
    this._startTimer()
  }

  _clearInterval() {
    clearInterval(this.state.interval)
    this.setState({
      interval: null
    })
  }

  _update() {
    let remaining = this.state.remaining - 1000
    if (remaining > 99) {
      this.setState({
        remaining: remaining
      })
    } else {
      this._clearInterval()
      startInstance()
    }
  }

  _mmss() {
    var date = new Date(this.state.remaining)
    var s = date.getSeconds()
    return date.getMinutes() + ':' + (s < 10 ? '0' : '') + s
  }

  render() {
    const {instance} = this.props
    switch (instance.getIn(['data','status'])) {
      default:
      case 'waiting':
        if (!this.state.interval) {
          return (
            <div className="instance">
              <h1 className="title animated rubberBand">Hungry Rabbit</h1>
              <button type="button" className="button" onClick={this._startTimer.bind(this)}>Start</button>
            </div>
          )
        } else {
          let location = window.location
          let joinUrl  = location.protocol + '//' + location.hostname
          return (
            <div className="instance">
              <h1 className="title animated rubberBand">It's Time To Join!</h1>
              <h2 className="title">{joinUrl}</h2>
              <h1 className="title">Starts in {this._mmss()}</h1>
            </div>
          )
        }
      case 'started':
        let count = Object.keys(instance.getIn(['data', 'users']).toJSON()).length
        if (count < Config.instance.minPlayers) {
          return (
            <div className="instance">
              <h1 className="title animated rubberBand">Not Enough Players</h1>
              <button type="button" className="button" onClick={this._restartTimer.bind(this)}>Restart</button>
            </div>
          )
        } else {
          return (
            <div className="instance">
              <List max={Config.instance.listMax} data={instance.get('data')}/>
            </div>
          )
        }
      case 'stopped':
        return (
          <div className="instance">
            <h1 className="title animated tada">The Winner Is</h1>
            <h2 className="title">{instance.getIn(['data','endState','winner','user','name'])}</h2>
            <button type="button" className="button" onClick={this._restartTimer.bind(this)}>Restart</button>
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