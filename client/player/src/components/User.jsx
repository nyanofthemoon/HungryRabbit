import React, {Component} from 'react'

require('react-tap-event-plugin')()

class User extends Component {
  render() {
    if (true === this.props.enabled) {
      return (
        <div>
          <img className='image' src={'/admin/assets/img/rabbit-' + this.props.user.get('image') + '-closed.png'}/>
          <h1>{this.props.user.get('name')}</h1>
          <br />
          <button className='tap' type="button" onTouchTap={this.props.handleTouchTap} onClick={this.props.handleClick}>
            Tap!
          </button>
          <br />
        </div>
      )
    } else {
      return (
        <div>
          <img className='image' src={'/admin/assets/img/rabbit-' + this.props.user.get('image') + '-closed.png'}/>
          <h1>{this.props.user.get('name')}</h1>
          <br />
          <button className='tap disabled' type="button">
            Wait
          </button>
        </div>
      )
    }
  }
}

export default User