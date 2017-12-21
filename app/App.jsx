import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import NavBarComponent from './NavBarComponent';
import PlantPage from './PlantPage';
import SettingsPage from './SettingsPage';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import * as gapi from './gapi';
import * as settings from './settings';


axios.defaults.baseURL = '/api';

let oAuthSignedIn = false;

class App extends React.Component {

    constructor(props) {
        super(props);

        // see if user still has oauth credentials
        setTimeout(() => {
            gapi.setCurrentUserListener(() => {

                oAuthSignedIn = gapi.isSignedIn()

                if (oAuthSignedIn) {
                    axios.defaults.headers['Authorization'] = `Bearer ${gapi.getIdToken()}`;

                    settings.login().then(res => {
                        console.log(res);
                        this.forceUpdate();
                    }).catch(err => {
                        if (err.response.status != 401) {
                            alert('Error logging in!');
                            console.log(err);
                        }
                        this.forceUpdate();
                    });
                } else {
                    settings.clear();
                    this.forceUpdate();
                }

            })
        }, 100);
    }

    renderSwitch() {
        if (oAuthSignedIn && settings.get() != null) {
            return (
                <Switch>
                    <Route path="/plants" exact component={PlantPage} />
                    <Route path="/settings" exact component={SettingsPage} />
                    <Route path="/about" exact component={AboutPage} />
                    <Redirect to="/plants" />
                </Switch>
            );
        } else if (oAuthSignedIn) {
            return (
                <Switch>
                    <Route path="/signup" exact component={SignupPage} />
                    <Route path="/about" exact component={AboutPage} />
                    <Redirect to="/signup" />
                </Switch>
            );
        } else {
            return (
                <Switch>
                    <Route path="/login" exact component={LoginPage} />
                    <Route path="/about" exact component={AboutPage} />
                    <Redirect to="/login" />
                </Switch>
            );
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <Route render={props => (<NavBarComponent {...props} loggedIn={oAuthSignedIn && settings.get() != null} />)} />
                    {this.renderSwitch()}
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));