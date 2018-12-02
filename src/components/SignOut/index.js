import React from 'react';

import { withFirebase } from '../Firebase';
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
  
const SignOutButton = ({ firebase }) => (
  <NavItem>
    <a href="#">
  <NavLink onClick={firebase.doSignOut} >Sign Out</NavLink>
  </a>
  </NavItem>

);

export default withFirebase(SignOutButton);
