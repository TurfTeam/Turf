import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Card, Button, CardText, CardBody, Row, Col, Input, Container, Alert } from 'reactstrap';

import firebase from 'firebase/app';
import 'firebase/firestore'

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  content: '',
  error: null,
  visible: false
};

class CreatePostBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onSubmit = () => {
    const { content, error } = this.state;
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    this.props.firebase.db.collection("blacklist").doc(authUser.uid)
    .get()
    .then(querySnapshot => {
      console.log("query.snapshot: ",querySnapshot.data());
      if(querySnapshot.data()=== undefined || querySnapshot.data() === null){
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

        //event.preventDefault();
      }
      else{
        console.log("display alert");
        this.state.visible = true;
        this.setState(this.state);
      }
    });
  }

  onDismiss() {
    this.state.visible = false;
    this.setState(this.state);
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
      <>
      <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
        Your posting privileges have been removed temporarily.
      </Alert>
      <Card className="card mt-3">
        <CardBody>
          <form >
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
              <Button className="text-center" id="orangebtn" disabled={isInvalid} onClick={this.onSubmit}>
                  Create Post
              </Button>
              </Row>
              </center>
              </Container>
              {error && <p>{error.message}</p>}
              </form>
        </CardBody>
      </Card>
      </>
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
