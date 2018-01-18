import * as React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, match, RouteComponentProps } from 'react-router-dom';

export default class NavBarComponent extends React.Component {

    constructor(props) {
        super(props);

        this.getActive = this.getActive.bind(this);
    }

    getActive(path) {
        return this.props.location.pathname.endsWith(path) ? "active" : ""
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
                    <li><Link onClick={this.props.logout} to="/logout">Logout</Link></li>
                </Nav>
            </Navbar.Collapse>
        );
    }

    renderLoggedOutNav() {
        return (
            <Navbar.Collapse>
                {!this.props.signingUp &&
                    <Nav>
                        <li className={this.getActive("login")}><Link to="/login">Login</Link></li>
                    </Nav>
                }
                {this.props.signingUp &&
                    <Nav>
                        <li className={this.getActive("signup")}><Link to="/signup">Signup</Link></li>
                    </Nav>
                }
                <Nav>
                    <li className={this.getActive("about")}><Link to="/about">About</Link></li>
                </Nav>
                {this.props.signingUp &&
                    <Nav>
                        <li><Link to="/signup" onClick={this.props.logout}>Switch Google Accounts</Link></li>
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