import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';

const AccountPage = () => (
<AuthUserContext.Consumer>
    {authUser => (
      <div id="signbox2">
      <div class="account">
      <center>
      <div style={{color: 'black', fontWeight: 'bold'}}>
      <br></br>
      <img src="http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" width="300" height="300" alt="turf.com">
        </img>
        <br></br>
        <br></br>
        <h1>Username:</h1> 
        <h2>{authUser.displayName}</h2>

        <div>       
           <br></br>

</div>
<h1>Email:</h1> 
        <h2>{authUser.email}</h2>
      </div>
      </center>
      </div> 
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
