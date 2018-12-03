import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Card, Button, CardText, CardBody, Row, Col, Input, Container } from 'reactstrap';

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
        //this.props.history.push(ROUTES.HOME);
        window.location.reload();
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
      <Card className="card mt-3">
        <CardBody>
          <form onSubmit={this.onSubmit}>
            <Container>
              <Row>
              <Input type="textarea"
                  style={{width:'100%'}}
                  name="content"
                  value={content}
                  onChange={this.onChange}
                  placeholder="Enter your post here."
              />
              </Row>
              <hr />
              <center>
              <Row>
              <Button className="text-center" disabled={isInvalid} type="submit">
                  Create Post
              </Button>
              </Row>
              </center>
              </Container>
              {error && <p>{error.message}</p>}
              </form>
        </CardBody>
      </Card>
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
