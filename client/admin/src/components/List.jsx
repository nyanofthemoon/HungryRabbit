import React, {Component, PropTypes} from 'react'

let _ = require('lodash')

class List extends Component {

  _getUser(id) {
    return this.props.data.getIn(['users', id])
  }

  // @NOTE Return Top that.props.max Items
  _getProcessedList() {
    let that  = this
    let state = this.props.data.get('state').toJSON()
    return _.take(Object.keys(state).map(function(key) {
      let user = that._getUser(key)
      return {id: user.get('name'), image: user.get('image'), data: state[key]}
    }).sort(function(a, b) {
      return b.data - a.data
    }), that.props.max)
  }

  render() {
    let wh  = window.innerHeight
    let max = this.props.data.get('condition')
    return (
      <div className="list">
        {this._getProcessedList().map(function(item) {
          let pos = wh * (item.data / max)
          return (<div key={item.id} className="list-item">
            <img className="carrot" style={{ top:pos }} src="/admin/assets/img/carrot.png"/>
            <div className="rabbit">
              <img id={'rabbit-' + item.id} src={'/admin/assets/img/rabbit-' + item.image + '-open.png'}/>
              <div className="rabbit-text">{item.id}</div>
            </div>
          </div>)
        })}
      </div>
    )
  }
}

export default List