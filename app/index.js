import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './root';

// import './index.less'

render(
  <AppContainer>
    <Root/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./root',() => {
    const NewHello = require('./root').default;
    render (
      <AppContainer>
       <NewHello/>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}