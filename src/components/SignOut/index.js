import React from 'react';
import { NavLink } from 'reactstrap';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <NavLink onClick={firebase.doSignOut}>Sign Out</NavLink>

);

export default withFirebase(SignOutButton);
