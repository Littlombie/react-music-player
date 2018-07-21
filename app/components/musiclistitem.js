import React from 'react'
import './musiclistitem.less';
let Pubsub  = require('pubsub-js');


let MusicListItem = React.createClass({
  palyMusic (musicItem) {
    Pubsub.publish('PLAY_MUSIC', musicItem) //往外发送数据
  },
  deleteMusic (musicItem, e) {
    e.stopPropagation();//阻止冒泡
    Pubsub.publish('DELETE_MUSIC', musicItem)
  },
  render() {
    let musicItem = this.props.musicItem;
    return (
      <li onClick={this.palyMusic.bind(this, musicItem)} className={`components-musiclistitem row ${this.props.focus ? 'focus':''}`}>
        <p><strong> {musicItem.title}</strong>-{musicItem.artist}</p>
        <p onClick={this.deleteMusic.bind(this, musicItem)} className="-col-auto delete"></p>
      </li>
    )
  }
});

export default MusicListItem;

