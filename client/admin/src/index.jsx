'use strict';

require('./scss/app.scss');

import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import Application from './containers/Application';
import store       from './store'
import audio       from './helpers/audio'

setTimeout(function() {
  render(
    <Provider store={store}>
      <Application />
    </Provider>,
    document.getElementById('root')
  );
}, 5000)