import React from 'react';
import ReactDOM from 'react-dom';
import 'style/index.scss';
import {App} from 'containers/app/app.container';
import * as serviceWorker from './serviceWorker';

import jss from 'jss';
import preset from 'jss-preset-default';
// One time setup with default plugins and settings.
jss.setup(preset());

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
