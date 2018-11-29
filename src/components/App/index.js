import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import AccountPage from '../Account';
import HomePage from '../Home';
<<<<<<< HEAD
import CreatePost from '../CreatePost';
=======
import ManagePostsPage from '../Home/ManagePosts';
>>>>>>> 706ce1a47e97ed5eed3a7c742a64bbb18200b69a

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.HOME} component={HomePage} />
<<<<<<< HEAD
      <Route exact path={ROUTES.NEW_POST} component={CreatePost} />
=======
      <Route exact path={ROUTES.MANAGE_POSTS} component={ManagePostsPage} />
>>>>>>> 706ce1a47e97ed5eed3a7c742a64bbb18200b69a
    </div>
  </Router>
);

export default withAuthentication(App);
