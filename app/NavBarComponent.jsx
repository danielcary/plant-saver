/*
 * Plant Saver
 * NavBarComponent.jsx
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, match, RouteComponentProps } from 'react-router-dom';

export default class NavBarComponent extends React.Component {

    renderLoggedInNav() {
        return (
            <Nav>
                <LinkContainer to="/plants">
                    <NavItem>Plants</NavItem>
                </LinkContainer>
                <LinkContainer to="/settings">
                    <NavItem>Settings</NavItem>
                </LinkContainer>
                <LinkContainer to="/about">
                    <NavItem>About</NavItem>
                </LinkContainer>
                <LinkContainer to="/logout">
                    <NavItem onClick={this.props.logout} >Logout</NavItem>
                </LinkContainer>
            </Nav>
        );
    }

    renderLoggedOutNav() {
        return (
            <Nav>
                {!this.props.signingUp &&
                    <LinkContainer to="/login">
                        <NavItem>Login</NavItem>
                    </LinkContainer>
                }
                {this.props.signingUp &&
                    <LinkContainer to="/signup">
                        <NavItem>Signup</NavItem>
                    </LinkContainer>
                }
                <LinkContainer to="/about">
                    <NavItem>About</NavItem>
                </LinkContainer>
                {this.props.signingUp &&
                    <LinkContainer to="/login">
                        <NavItem onClick={this.props.logout}>Switch Google Account</NavItem>
                    </LinkContainer>
                }
            </Nav>
        );
    }

    render() {
        return (
            <Navbar fixedTop>
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