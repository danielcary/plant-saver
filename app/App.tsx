import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import NavBarComponent from './NavBarComponent';
import MainPage from './MainPage';
import SettingsPage from './SettingsPage';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';

import * as gapi from './gapi';
import * as settings from './settings';

axios.defaults.baseURL = 'http://localhost:62736/api'

let signedIn = false

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        signedIn ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
    )} />
)

class App extends React.Component<{}, {}> {

    constructor(props) {
        super(props);

        setTimeout(() => {
            gapi.setCurrentUserListener(() => {

                signedIn = gapi.isSignedIn()

                if (signedIn) {
                    axios.defaults.headers['Authorization'] = `Bearer ${gapi.getIdToken()}`;

                    settings.login().then(res => {
                        console.log(res);
                        this.forceUpdate();
                    }).catch(err => {
                        console.log(err);
                        this.forceUpdate();
                    });
                } else {
                    this.forceUpdate();
                }
            })
        }, 100);
    }

    render() {
        return (
            <Router>
                <div>
                    <Route render={props => (<NavBarComponent {...props} loggedIn={signedIn} />)} />
                    <Switch>
                        {(!signedIn && <Route path="/login" exact component={LoginPage} />)}
                        <PrivateRoute path="/plants" exact component={MainPage} />
                        <PrivateRoute path="/settings" exact component={SettingsPage} />
                        <Route path="/about" exact component={AboutPage} />
                        {(!settings.get().locationId && <Redirect to="/settings" />)}
                        <Redirect to="/plants" />
                    </Switch>
                </div>
            </Router>
        );
    }

}

ReactDOM.render(<App />, document.getElementById("app"));