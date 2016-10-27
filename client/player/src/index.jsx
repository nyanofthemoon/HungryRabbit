'use strict';

require('./scss/app.scss');

// Prevent Dbl-Tap Zooms on Devices
document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
  event.stopPropagation();
}, false);

import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import Application from './containers/Application';
import store       from './store'

setTimeout(function() {
  render(
    <Provider store={store}>
      <Application />
    </Provider>,
    document.getElementById('root')
  );
}, 250);