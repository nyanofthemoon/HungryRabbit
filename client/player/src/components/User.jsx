import React, {Component} from 'react'

require('react-tap-event-plugin')()

class User extends Component {
  render() {
    if (true === this.props.enabled) {
      return (
        <button className='tap' type="button" onTouchTap={this.props.handleTouchTap} onClick={this.props.handleClick}>
          Tap Me
        </button>
      )
    } else {
      return (
        <button className='tap disabled' type="button">
          Tap Me
        </button>
      )
    }
  }
}

export default User