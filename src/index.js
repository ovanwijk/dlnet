import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Switch, Route } from 'react-router-dom';
import QRDownloader from './components/QRDownloader';

const Routees = () => (
    <HashRouter>
        <Switch>
            {/* <Route path="/private" component={Private}/>
            <Route path="/public/:iotaPayReference" component={Public}/>
            <Route path="/public" component={Public}/>
            <Route path="/:iotaPayReference" component={Public}/> */}
            <Route path="/qr/:name/:size/:stayopen/:base64" component={QRDownloader}/>
            <Route path="/" component={App}/>
            
        </Switch>
        
    </HashRouter>
);

ReactDOM.render(Routees(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
