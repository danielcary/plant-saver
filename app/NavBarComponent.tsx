import * as React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, match, RouteComponentProps } from 'react-router-dom';

import * as gapi from './gapi';

export interface INavBarComponentProps extends RouteComponentProps<any> {
    loggedIn?: boolean;
}

export default class NavBarComponent extends React.Component<INavBarComponentProps, {}> {

    constructor(props: INavBarComponentProps) {
        super(props);

        this.getActive = this.getActive.bind(this);
    }

    getActive(path) {
        return this.props.location.pathname.endsWith(path) ? "active" : ""
    }

    logout() {
        gapi.signOut()
    }

    renderLoggedInNav() {
        return (
            <Navbar.Collapse>
                <Nav>
                    <li className={this.getActive("plants")}><Link to="/plants">Plants</Link></li>
                </Nav>
                <Nav>
                    <li className={this.getActive("settings")}><Link to="/settings">Settings</Link></li>
                </Nav>
                <Nav>
                    <li className={this.getActive("about")}><Link to="/about">About</Link></li>
                </Nav>
                <Nav>
                    <li><a onClick={() => gapi.signOut()}>Logout</a></li>
                </Nav>
            </Navbar.Collapse>
        );
    }

    renderLoggedOutNav() {
        return (
            <Navbar.Collapse>
                {this.props.location.pathname.endsWith("login") &&
                    <Nav>
                        <li className={this.getActive("login")}><Link to="/login">Login</Link></li>
                    </Nav>
                }
                {this.props.location.pathname.endsWith("signup") &&
                    <Nav>
                        <li className={this.getActive("signup")}><Link to="/signup">Signup</Link></li>
                    </Nav>
                }
                <Nav>
                    <li className={this.getActive("about")}><Link to="/about">About</Link></li>
                </Nav>
                {this.props.location.pathname.endsWith("signup") &&
                    <Nav>
                        <li><a onClick={() => gapi.signOut()}>Switch Google Accounts</a></li>
                    </Nav>
                }
            </Navbar.Collapse>
        );
    }

    render() {
        return (
            <Navbar inverse fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        Plant Saver
                    </Navbar.Brand>
                </Navbar.Header>
                {this.props.loggedIn && this.renderLoggedInNav()}
                {!this.props.loggedIn && this.renderLoggedOutNav()}
            </Navbar>
        );
    }

}