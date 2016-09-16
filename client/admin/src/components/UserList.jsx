import React, {Component, PropTypes} from 'react'

class UserList extends Component {
  render() {
    return (
      <div>
        <h2>User List</h2>
        <ul>
        {this.props.users.map(function(user, index) {
          return (<li key={index}>{user.get('name')}</li>)
        })}
        </ul>
      </div>
    )
  }
}

UserList.contextTypes = {
  users: PropTypes.object.isRequired
}

export default UserList