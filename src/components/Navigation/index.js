import React from 'react';
//import { NavLink } from 'react-router-dom';
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


export default class Navigation extends React.Component {
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
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
              }
            </AuthUserContext.Consumer>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const NavigationAuth = () => (
  <Nav className="ml-auto" navbar>
    <AuthUserContext.Consumer>{authUser => authUser.email === "admins@turf.com" ? <><NavigationAdminManagePosts /> <NavigationAdminManageUsers /></> : <NavigationNotifications />}</AuthUserContext.Consumer>
    <NavItem>
      <SignOutButton />
    </NavItem>
  </Nav>
);

const NavigationNotifications = () => (
  <div>
        <Button color="primary" outline>
          Notifications <Badge color="secondary">4</Badge>
        </Button>
      </div>
);

const NavigationNonAuth = () => (
  <Nav className="ml-auto" navbar>
    <NavigationLanding />
    <NavigationSignIn />
  </Nav>
);

const NavigationAdminManagePosts = () => (
  <NavItem>
      <NavLink href={ROUTES.MANAGE_POSTS}>Manage Posts</NavLink>
  </NavItem>
);

const NavigationAdminManageUsers = () => (
  <NavItem>
      <NavLink href={ROUTES.MANAGE_USERS}>Manage Users</NavLink>
  </NavItem>
);

const NavigationLanding = () => (
  <NavItem>
      <NavLink href={ROUTES.LANDING}>Landing</NavLink>
    </NavItem>
);

const NavigationSignIn = () => (
  <NavItem>
    <NavLink href={ROUTES.SIGN_IN}>Sign In</NavLink>
    </NavItem>
);
