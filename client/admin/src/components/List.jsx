import React, {Component, PropTypes} from 'react'

let _ = require('lodash')

class List extends Component {

  _getUser(id) {
    return this.props.data.getIn(['users', id])
  }

  _getProcessedList() {
    let that  = this
    let state = this.props.data.get('state').toJSON()
    let wh  = window.innerHeight
    let max = this.props.data.get('condition')
    return _.take(Object.keys(state).map(function(key) {
      let user = that._getUser(key)
      let id   = user.get('id')
      let pos  = wh * (state[key] / max)
      let prevPos = pos
      let carrot = document.querySelector('#carrot-' + id)
      let anim   = false
      if (carrot) {
        prevPos = carrot.style.top.replace('px','')
      }
      if (pos > prevPos) {
        anim = true
      }
      return {id: user.get('id'), name: user.get('name'), image: user.get('image'), data: state[key], prevPos:parseInt(prevPos), pos: pos, anim: anim}
    }).sort(function(a, b) {
      return b.data - a.data
    }), that.props.max)
  }

  render() {
    let that = this
    return (
      <div className="list">
        {this._getProcessedList().map(function(item) {
          if (true === item.anim) {
            setTimeout(function() {
              let image = document.querySelector('#rabbit-' + item.id)
              if (image) {
                if (Math.floor(Math.random() * 5) == 3) {
                  that.props.playSound('munch')
                }
                image.src = '/admin/assets/img/rabbit-' + item.image + '-closed.png'
                setTimeout(function() {
                  image.src = '/admin/assets/img/rabbit-' + item.image + '-open.png'
                }, 100)
              }
            }, 10)
          }
          return (<div key={item.id} className="list-item">
            <img id={'carrot-' + item.id} className='carrot' style={{ top:item.pos }} src="/admin/assets/img/carrot.png"/>
            <div className="rabbit">
              <img id={'rabbit-' + item.id} className="rabbit" src={'/admin/assets/img/rabbit-' + item.image + '-open.png'}/>
              <div className={'rabbit-text rabbit-text-' + item.image}>{item.name}</div>
            </div>
          </div>)
        })}
      </div>
    )
  }
}

export default List