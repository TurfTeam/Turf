import React, { Component } from 'react';
//import { NavLink } from 'react-router-dom';
import { compose } from 'recompose';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button } from 'reactstrap';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';


class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href={ROUTES.HOME}>Turf</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <AuthUserContext.Consumer>
              {authUser =>
                authUser ? this.NavigationAuth() : this.NavigationNonAuth()
              }
            </AuthUserContext.Consumer>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  NavigationAuth = () => {
    return (
      <Nav className="ml-auto" navbar>
        <AuthUserContext.Consumer>{authUser => authUser.email === "admins@turf.com" ? <> {this.NavigationAdminManageUsers()} {this.NavigationAdminManagePosts()} </> : this.NavigationNotifications(authUser.uid)}</AuthUserContext.Consumer>
        <NavItem>
          <SignOutButton />
        </NavItem>
      </Nav>
    );
  }

  NavigationNonAuth = () => {
    return (
      <Nav className="ml-auto" navbar>
        {this.NavigationLanding()}
        {this.NavigationSignIn()}
      </Nav>
    );
  }

  NavigationNotifications = (uid) => {
    console.log("NOTIFICATIONS: ",uid);
    this.props.firebase.db.collection("users").doc(uid)
    .get()
    .then(user => {
      console.log("querySnapshot: ",user.data());

      return (
        <div>
              <Button color="primary" outline>
                Notifications <Badge color="secondary">{user.data().notifications.length}</Badge>
              </Button>
            </div>
      );
    });
  }

  NavigationAdminManagePosts = () => {
    return (
      <NavItem>
          <NavLink href={ROUTES.MANAGE_POSTS}>Manage Posts</NavLink>
      </NavItem>
    );
  }

  NavigationAdminManageUsers = () => {
    return (
      <NavItem>
          <NavLink href={ROUTES.MANAGE_USERS}>Manage Users</NavLink>
      </NavItem>
    );
  }

  NavigationLanding = () => {
    return (
      <NavItem>
          <NavLink href={ROUTES.LANDING}>Landing</NavLink>
        </NavItem>
    );
  }

  NavigationSignIn = () => {
    return (
      <NavItem>
        <NavLink href={ROUTES.SIGN_IN}>Sign In</NavLink>
        </NavItem>
    );
  }
}

export default compose(
    withFirebase
)(Navigation);
