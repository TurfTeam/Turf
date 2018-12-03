import React from 'react';

import { withFirebase } from '../Firebase';
import {
  NavItem,
  NavLink,
} from 'reactstrap';

const SignOutButton = ({ firebase }) => (
  <NavItem>
    <a href="#">
  <NavLink style={{color: 'white', fontWeight: 'bold'}} onClick={firebase.doSignOut} >Sign Out</NavLink>
  </a>
  </NavItem>

);

export default withFirebase(SignOutButton);
