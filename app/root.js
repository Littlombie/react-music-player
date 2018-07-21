import React from 'react'
import Header from './components/header'
import Player from './page/player'
import MusicList from './page/musiclist'
import RandomRange from './utils/utils'
import { MUSIC_LIST } from './config/musiclist'
import {Router, IndexRoute, Link, Route, hashHistory} from 'react-router'
let Pubsub  = require('pubsub-js');

let repeatList = [
  'cycle',
  'once',
  'random'
];

let App = React.createClass({
  getInitialState() {
    return {
      musicList:MUSIC_LIST,
      currentMusicItem: MUSIC_LIST[0],
      repeatType:'cycle'
    }
  },
  playMusic(musicItem) {
    $('#player').jPlayer('setMedia', {
      mp3: musicItem.file
    }).jPlayer('play');
    if (this._isMounted ) {
      this.setState({
        currentMusicItem: musicItem
      })
    }
  },
  playWhenEnd() {
    if (this.state.repeatType === "random") {
      let index  = this.findMusicIndex(this.state.currentMusicItem);
      let randomIndex = RandomRange(0, this.state.musicList.length - 1);
      while(randomIndex === index) {
        randomIndex = RandomRange(0, this.state.musicList.length - 1);
      }
			this.playMusic(this.state.musicList[randomIndex]);
    } else if (this.state.repeatType === "once") {
			this.playMusic(this.state.currentMusicItem);
    } else {
      this.playNext();
    }
  },
  playNext(type="next") {
    let index = this.findMusicIndex(this.state.currentMusicItem);
    let NewIndex = null;
    let musicListLength = this.state.musicList.length;
    if (type === "next") {
      NewIndex = (index + 1) % musicListLength;
    } else {
      NewIndex = (index - 1 + musicListLength) % musicListLength;
    }
    this.playMusic(this.state.musicList[NewIndex]);
  },
  findMusicIndex(musicItem) {
    let index = this.state.musicList.indexOf(musicItem);
    return Math.max(0, index);
  },
  componentWillMount(){
    this._isMounted  = true;
  },
  componentDidMount() {
    $('#player').jPlayer({
      supplied: 'mp3',
      wmode: 'window',
			useStateClassSkin: true
    });
    this.playMusic(this.state.currentMusicItem);
    $('#player').bind($.jPlayer.event.ended, (e) => {
      this.playWhenEnd();
    })
    Pubsub.subscribe('DELETE_MUSIC', (msg,musicItem) => {
      if (this._isMounted) {
        this.setState({
          musicList: this.state.musicList.filter( item => {
            return item !== musicItem;
          })
        })
      }
      
    });
    Pubsub.subscribe('PLAY_MUSIC', (msg,musicItem) => {
      this.playMusic(musicItem)
    });
    
    Pubsub.subscribe('PLAY_PREV', () => {
      this.playNext('prev');
    }) ;
    
    Pubsub.subscribe('PLAY_NEXT', () => {
      this.playNext();
    });
    Pubsub.subscribe('CHANAGE_REPEAT', () => {
      let index = repeatList.indexOf(this.state.repeatType);
      // 下一个数组 取余
      index = (index + 1) % repeatList.length;
      if (this._isMounted) {
        this.setState({
          repeatType: repeatList[index]
        })
      }
    })
  },
  componentWillUnmount() { //react声明周期解绑
    this._isMounted  = false;
    Pubsub.unsubscribe('DELETE_MUSIC');
    Pubsub.unsubscribe('PLAY_MUSIC');
    Pubsub.unsubscribe('CHANAGE_REPEAT');
    Pubsub.unsubscribe('PLAY_PREV');
    Pubsub.unsubscribe('PLAY_NEXT');
    // $('#player').unbind($.jPlayer.event.ended);
  },
  render() {
    return (
      <div>
        <Header/>
        { React.cloneElement(this.props.children, this.state)}
      </div>
    );
  }
}) 

let Root = React.createClass({
  render () {
    return( <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Player}></IndexRoute>
        <Route path="/list" component={MusicList}></Route>
      </Route>
    </Router>
    );
  }
});

export default Root;
