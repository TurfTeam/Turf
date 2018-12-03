import React, { Component } from 'react';
import { compose } from 'recompose';
import { Container, Row, Col, Collapse, View } from 'reactstrap';
import { Card, Button, CardText, CardBody } from 'reactstrap';
import {Form, FormGroup, Label, Input, Alert} from 'reactstrap';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

import firebase from 'firebase/app';
import 'firebase/firestore'

import * as ROUTES from '../../constants/routes';
import CreatePost from '../CreatePost';


import { Redirect } from 'react-router-dom';

class LandingPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          posts: [],
          collapse: [],
          comments: [],
          newComments: [],
          visible: false
      };

    }

    componentDidMount() {
    }

    componentWillMount() {
        // this.props.firebase.posts().off();
    }

    render() {
        const { posts } = this.state;
        return (
            <Container>
            <Row>
            <Col>
              <center><img style={{width: '80%', borderRadius: '50%'}}src={require('./splash.png')} /></center>
              </Col>
              </Row>
              <br />
              <Row>
              <Col>
               <center><Button outline color="secondary" href={ROUTES.SIGN_IN} size="lg">Sign In</Button>{'  '}
               <Button outline color="secondary" href={ROUTES.SIGN_UP} size="lg">Sign Up</Button></center>
              </Col>
              </Row>

            </Container>
        )
    }

}

export default compose(
    withFirebase
)(LandingPage);
