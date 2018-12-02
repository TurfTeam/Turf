import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Button } from 'reactstrap';

const SignUpPage = () => (
  <center>
  <div>
    <h1>Sign up</h1>
    <SignUpForm />
  </div>
  </center>
);

const INITIAL_STATE = {
  name: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { name, email, password } = this.state;


    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user.updateProfile({
          displayName: name
        }).then(() => {
          this.props.firebase.doCreateUserRole(authUser.user.uid, email);
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.LANDING);
        }).catch((error) => {
          this.setState({ error });
        });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      name,
      email,
      password,
      passwordConfirmation,
      error,
    } = this.state;

    const isInvalid =
      password !== passwordConfirmation ||
      password === '' ||
      email === '' ||
      name === '';

    return (
      <form onSubmit={this.onSubmit}>
            <center>
        <div class="form-group">
         <input
          name="name"
          value={name}
          onChange={this.onChange}
          type="name"
          placeholder="Full Name"
        />
        </div>
        <div class="form-group">
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="email"
          placeholder="Email Address"
        />
        </div>
        <div class="form-group">
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        </div>
        <div class="form-group">
        <input
          name="passwordConfirmation"
          value={passwordConfirmation}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        </div>
        </center>
        <center>
        <Button disabled={isInvalid} type="submit">
          Sign Up
        </Button>
        </center>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    <center>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </center>
  </p>
);
const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);
export default SignUpPage;
export { SignUpForm, SignUpLink };
