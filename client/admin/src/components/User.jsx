import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class User extends Component {
  render() {
    const {user} = this.props
    let name     = user.getIn(['data', 'name'])
    return (<div id="user">You are {name}</div>)
  }
}

User.contextTypes = {
  store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(User)