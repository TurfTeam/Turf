import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';

const AccountPage = () => (
<AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <h1>Display Name: {authUser.displayName}</h1>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
