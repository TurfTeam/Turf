import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import firebase from 'firebase/app';
import 'firebase/firestore'

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  content: '',
  error: null,
};

class CreatePostBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { content, error } = this.state;
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    this.props.firebase.posts().add({
        content,
        reported: false,
        creator: authUser.uid,
        created: firebase.firestore.Timestamp.now(),
        comments: [],
        upvotes: [],
        downvotes: [],
    }).then((post) => {
        console.log(this.props.firebase.db.FieldValue);
        console.log(post);
        this.props.firebase.user(authUser.uid).update({
            posts: firebase.firestore.FieldValue.arrayUnion(post.id),
        });

        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
    }).catch((error) => {
        console.log(error)
        this.setState({ error });
    });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
        content,
        error,
    } = this.state;
    
    const isInvalid = content === '';

    return (
        <form onSubmit={this.onSubmit}>
            <textarea
                name="content"
                value={content}
                onChange={this.onChange}
                placeholder="Enter your post here."
            ></textarea>
            <button disabled={isInvalid} type="submit">
                Create Post
            </button>
            {error && <p>{error.message}</p>}

    </form>
    );
  }
}

const condition = authUser => !!authUser;

const CreatePost = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition),
)(CreatePostBase);

export default CreatePost;
