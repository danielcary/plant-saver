import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { setAuth } from './axios';
import NavBarComponent from './NavBarComponent';
import PlantPage from './PlantPage';
import SettingsPage from './SettingsPage';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import * as settings from './settings';
import { setTimeout } from 'timers';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            oAuthEmail: null
        };
    }

    loginSuccess(res) {
        // use the id token for authenticated call
        setAuth(`Bearer ${res.tokenId}`)

        // get user info
        settings
            .login()
            .catch(err => {
                if (err.response.status != 401) {
                    alert('Error logging in!');
                    console.log(err);
                }
            })
            .then(() => this.setState({ signedIn: true, oAuthEmail: res.profileObj.email }));
    }

    logout() {
        setAuth('');
        settings.clear();
        this.setState({ signedIn: false, oAuthEmail: null });
    }

    renderSwitch() {
        if (this.state.signedIn && settings.get() != null) {
            return (
                <Switch>
                    <Route path="/plants" exact component={PlantPage} />
                    <Route path="/settings" exact render={props =>
                        <SettingsPage {...props}
                            signOut={() => this.setState({ signedIn: false, oAuthEmail: null })}
                        />
                    } />
                    <Route path="/about" exact component={AboutPage} />
                    <Redirect from="/logout" to="/" />
                    <Redirect to="/plants" />
                </Switch>
            );
        } else if (this.state.signedIn) {
            return (
                <Switch>
                    <Route path="/signup" exact render={props =>
                        <SignupPage {...props}
                            email={this.state.oAuthEmail}
                            signedUp={() => {
                                settings.login()
                                    .then(res => console.log(res))
                                    .catch(err => {
                                        if (err.response.status != 401) {
                                            alert('Error logging in!');
                                        }
                                        console.log(err);
                                    }).then(() => this.forceUpdate());
                            }} />} />
                    <Route path="/about" exact component={AboutPage} />
                    <Redirect to="/signup" />
                </Switch>
            );
        } else {
            return (
                <Switch>
                    <Route path="/login" exact render={props =>
                        <LoginPage {...props}
                            onLoginSuccess={this.loginSuccess.bind(this)}
                        />} />
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
                    <Route render={props =>
                        <NavBarComponent {...props}
                            logout={this.logout.bind(this)}
                            signingUp={this.state.signedIn && settings.get() == null}
                            loggedIn={this.state.signedIn && settings.get() != null}
                        />} />
                    {this.renderSwitch()}
                </div>
            </Router>
        );
    }
}

//document.getElementsByName('google-signin-client_id')[0].setAttribute('content', process.env.GOOGLE_OAUTH_AUD);
ReactDOM.render(<App />, document.getElementById("app"));