import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Button } from "reactstrap";

class ManageUsersPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          users: [],
          blacklisted: []
      };
    }

    componentDidMount() {
      this.setState({ loading: true });

      this.props.firebase.db.collection("blacklist")
      .get()
      .then((querySnapshot1) => {
        var blacklistIDs = [];
        querySnapshot1.docs.forEach(doc => {
          blacklistIDs.push(doc.id);
        });
        this.props.firebase.users()
        .get()
        .then((querySnapshot) => {
          var users = [];
          var blacklisted = [];
          var count = 0;
            querySnapshot.docs.forEach(doc => {
              count++;
              console.log("doc: ",doc.id);
              if(blacklistIDs.indexOf(doc.id) === -1){
                console.log("doc: ",doc.data().email);
                console.log(blacklistIDs.indexOf(doc.id));
                users.push(doc);
              }
              else{
                blacklisted.push(doc);
              }

              if(count === querySnapshot.docs.length){
                this.setState({
                  users: users,
                  blacklisted: blacklisted,
                  loading: false
                });
              }
            });
            });
            /*

            console.log(this.state.users);
            console.log(this.state.users[0].id);
            console.log(this.state.users[0].data().email);*/
        });
      }

    componentWillUnmount() {
    }

    onBlacklist(user){
      console.log("UID: ",user);
      console.log("YO");
      console.log("index: ",this.state.users.indexOf(user));
      this.state.users.splice(this.state.users.indexOf(user),1);
      this.state.blacklisted.push(user);
      this.setState(this.state);
      this.props.firebase.doBlackListUser(user);
    }

    onRestorePrivileges(user){
      console.log("UID: ",user);
      console.log("YO");
      console.log("index: ",this.state.users.indexOf(user));
      this.state.blacklisted.splice(this.state.blacklisted.indexOf(user),1);
      this.state.users.push(user);
      this.setState(this.state);
      this.props.firebase.doRestoreUserPrivileges(user);
    }

    render() {
    const { users, blacklisted } = this.state;

    return (
      <div>
        <h1>Current Users</h1>
        <ul>
    {users.map(user => (
      <li key={user.id}>
        <span>
          <strong>ID:</strong> {user.id}
        </span>
        <span>
        &nbsp;
          <strong>E-Mail:</strong> {user.data().email}
        </span>
        <span>
        &nbsp;
          <strong>Role:</strong> {user.data().role}
        </span>
        &nbsp;
        <br></br>
        <Button size="sm" onClick={() => {this.onBlacklist(user)}}>Blacklist</Button>
      </li>
    ))}
  </ul>
  <h1> Blacklisted Users </h1>
  <ul>
  {blacklisted.map(user => (
    <li key={user.id}>
      <span>
        <strong>ID:</strong> {user.id}
        &nbsp;
      </span>
      <span>
        <strong>E-Mail:</strong> {user.data().email}
      </span>
      <span>
      &nbsp;
        <strong>Role:</strong> {user.data().role}
        &nbsp;
      </span>
      &nbsp;
      <br></br>
      <Button size="sm" onClick={() => {this.onRestorePrivileges(user)}}>Restore Privileges</Button>
    </li>
  ))}
  </ul>
      </div>
    );
  }
}




const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition),
)(ManageUsersPage);
