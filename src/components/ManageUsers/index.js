import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

class ManageUsersPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          users: []
      };
    }

    componentDidMount() {
      this.setState({ loading: true });

      this.props.firebase.users()
      .get()
      .then((querySnapshot) => {
          this.setState({
              loading: false,
              users: querySnapshot.docs,
          })

          console.log(this.state.users);
          console.log(this.state.users[0].id);
          console.log(this.state.users[0].data().email);
      });
      /*this.props.firebase.users().on('value', snapshot => {
        const usersObject = snapshot.val();

        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
        }));

        this.setState({
          users: usersList,
          loading: false,
        });

        console.log(this.state.users);
      });*/

        /*this.props.firebase.posts().where("reported", "==", true)
        .get()
        .then((querySnapshot) => {
            this.setState({
                loading: false,
                posts: querySnapshot.docs,
            })
        });*/
    }

    componentWillUnmount() {
    }

    onBlacklist(u){
      console.log("UID: ",u);
      console.log("YO");
      console.log("index: ",this.state.users.indexOf(u));
      this.state.users.splice(this.state.users.indexOf(u),1);
      this.setState(this.state);
      //this.props.firebase.doPostRemove(postId);
    }

    render() {
    const { users } = this.state;

    return (
      <div>
        <h1>Admin</h1>
        <ul>
    {users.map(user => (
      <li key={user.id}>
        <span>
          <strong>ID:</strong> {user.data().uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.data().email}
        </span>
        <span>
          <strong>Role:</strong> {user.data().role}
        </span>
        <button onClick={() => {this.onBlacklist(user)}}>Blacklist</button>
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
