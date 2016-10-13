let _ = require('lodash')
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {startInstance, restartInstance} from './../actions'
import {playMusic, playSound} from './../helpers/audio'

import List from '../components/List'

import Config from './../config'

class Instance extends Component {

  constructor(props) {
    super(props)
    this.state = {
      remaining: null,
      interval : null,
      music    : null
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

  _playMusic(id) {
    if (this.state.music != id) {
      playMusic(id)
      this.setState({
        music: id
      })
    }
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
          let that = this
          setTimeout(function() {
            that._playMusic('title-screen')
          }, 750)
          return (
            <div className="instance">
              <h1 className="title animated rubberBand">Hungry Rabbit</h1>
              <button type="button" className="button" onClick={this._startTimer.bind(this)}>Start</button>
            </div>
          )
        } else {
          this._playMusic('wait-screen')
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
          this._playMusic('title-screen')
          return (
            <div className="instance">
              <h1 className="title animated pulse">Not Enough Players</h1>
              <button type="button" className="button" onClick={this._restartTimer.bind(this)}>Restart</button>
            </div>
          )
        } else {
          this._playMusic('game-screen')
          return (
            <div className="instance">
              <List max={Config.instance.listMax} data={instance.get('data')} playSound={playSound}/>
            </div>
          )
        }
      case 'stopped':
        this._playMusic('over-screen')
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