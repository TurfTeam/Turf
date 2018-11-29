import React from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';



const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <AuthUserContext.Consumer>{authUser => authUser.email === "admins@turf.com" ? <NavigationAdmin /> : null}</AuthUserContext.Consumer>
    <li>
    <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
    </ul>
);

const NavigationAdmin = () => (
  <ul>
    <li>
      <Link to={ROUTES.MANAGE_POSTS}>MP</Link>
    </li>
    <li>
      <Link to={ROUTES.MANAGE_USERS}>MU</Link>
    </li>
  </ul>
);

export default Navigation;
