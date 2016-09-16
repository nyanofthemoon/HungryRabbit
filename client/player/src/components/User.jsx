import React, {Component} from 'react'

require('react-tap-event-plugin')()

class User extends Component {
  render() {
    return (
      <button className="tap" type="button" onTouchTap={this.props.handleTouchTap} onClick={this.props.handleClick}>
        Tap Me
      </button>
    )
  }
}

export default User