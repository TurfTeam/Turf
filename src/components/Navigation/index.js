import React, { Component } from 'react';
//import { NavLink } from 'react-router-dom';
import { compose } from 'recompose';
import {
  Container,
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
  Button,
  Popover,
  PopoverHeader,
  PopoverBody } from 'reactstrap';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';


class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.togglePopover = this.togglePopover.bind(this);

    this.state = {
      isOpen: false,
      notifications: [],
      popoverOpen: false,
      u: ""
    };
  }
  toggle() {
    this.state.isOpen = !this.state.isOpen;
    this.setState(this.state);
  }

  togglePopover() {
    if(this.state.popoverOpen === true && this.state.notifications.length !== 0){
      this.state.notifications = [];
      this.state.popoverOpen = !this.state.popoverOpen;
      this.setState(this.state);

      this.props.firebase.db.collection("users").doc(this.state.u)
      .get()
      .then(q => {
        this.props.firebase.db.collection("users").doc(this.state.u)
        .set({
          blacklisted: q.data().blacklisted,
          email: q.data().email,
          notifications: [],
          posts: q.data().posts,
          role: q.data().role
        }).then(() => {
          console.log("Notifications updated");
        })
        .catch(error => {
          console.error("Error clearing notifications: ",error);
        });
      })
    }
    if(this.state.notifications.length !== 0){
      this.state.popoverOpen = !this.state.popoverOpen;
      this.setState(this.state);
    }
  }
  render() {
    return (
      <div>
        <Navbar style={{backgroundColor: '#00CFCF', marginBottom: "0px", paddingBottom: "0px"}} light expand="md">
            <NavbarBrand><Container><div id="signlogo" style={{height: '62px', width: '115px'}}></div></Container></NavbarBrand>
          <NavbarToggler style={{color: 'white'}} onClick={this.toggle} />
          <Collapse style={{color: 'white'}} isOpen={this.state.isOpen} navbar>
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
      <Nav className="ml-auto" navbar style={{marginBottom: "0px", paddingBottom: "0px"}}>
        <AuthUserContext.Consumer>{authUser => authUser.email === "admins@turf.com" ? <> {this.NavigationNotifications(authUser.uid)} {this.NavigationAdminManageUsers()} {this.NavigationAdminManagePosts()} </> : this.NavigationNotifications(authUser.uid)}</AuthUserContext.Consumer>
        <NavItem>
          <SignOutButton />
        </NavItem>
      </Nav>
    );
  }

  NavigationNonAuth = () => {
    return (
      <Nav className="ml-auto" navbar style={{marginBottom: "0px", paddingBottom: "0px"}}>
        {this.NavigationLanding()}
        {this.NavigationSignIn()}
      </Nav>
    );
  }

  NavigationNotifications = (uid) => {
    this.props.firebase.db.collection("users").doc(uid)
    .get()
    .then(querySnapshot => {
      if(querySnapshot.data() !== undefined){
        this.state.u = uid;
        if(querySnapshot.data().notifications !== undefined || querySnapshot.data().notifications !== null) this.state.notifications = querySnapshot.data().notifications;
        this.setState(this.state);
      }
    });
      return (
        <div>
              <Button  style={{backgroundColor: "#00CFCF", color: "white", fontWeight: "bold", borderColor: "#00cfcf" }} outline id="Popover1" onClick={this.togglePopover}>
                Notifications <Badge color="secondary">{this.state.notifications.length}</Badge>
              </Button>
              <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.togglePopover}>
                {this.state.notifications.length > 0 ? this.state.notifications.map(this.createNotificationsRender, this) : null}
                </Popover>
            </div>
      );
  }

  createNotificationsRender(notification, index){
    return (
      <PopoverHeader>
      {notification}
      </PopoverHeader>
  );
  }


  NavigationAdminManagePosts = () => {
    return (
      <NavItem>
          <NavLink style={{color: 'white', fontWeight: 'bold'}} href={ROUTES.MANAGE_POSTS}>Manage Posts</NavLink>
      </NavItem>
    );
  }

  NavigationAdminManageUsers = () => {
    return (
      <NavItem>
          <NavLink style={{color: 'white', fontWeight: 'bold'}} href={ROUTES.MANAGE_USERS}>Manage Users</NavLink>
      </NavItem>
    );
  }

  NavigationLanding = () => {
    return (
      <NavItem>
        </NavItem>
    );
  }

  NavigationSignIn = () => {
    return (
      <>
      <NavItem>
        <NavLink style={{color: 'white', fontWeight: 'bold'}} href={ROUTES.SIGN_UP}>Sign Up</NavLink>
        </NavItem>
      <NavItem>
        <NavLink style={{color: 'white', fontWeight: 'bold'}} href={ROUTES.SIGN_IN}>Sign In</NavLink>
        </NavItem>
        </>
    );
  }
}

export default compose(
    withFirebase
)(Navigation);
