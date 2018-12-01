import React from 'react';
import { NavLink } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';



const Navigation = () => (
  <nav className="navbar navbar-default">
  <div className="container">
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
  </nav>
);

const NavigationAuth = () => (
  <ul>
    <li>
      <NavLink to={ROUTES.HOME}>Home</NavLink>
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
      <NavLink to={ROUTES.LANDING}>Landing</NavLink>
    </li>
    <li>
      <NavLink to={ROUTES.SIGN_IN}>Sign In</NavLink>
    </li>
    </ul>
);

const NavigationAdmin = () => (
  <ul>
    <li>
      <NavLink to={ROUTES.MANAGE_POSTS}>Manage Posts</NavLink>
    </li>
    <li>
      <NavLink to={ROUTES.MANAGE_USERS}>Manage Users</NavLink>
    </li>
  </ul>
);

export default Navigation;
