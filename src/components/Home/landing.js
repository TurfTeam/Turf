import React, { Component } from 'react';
import { compose } from 'recompose';
import { Container, Row, Col, Collapse, View } from 'reactstrap';
import { Card, Button, CardText, CardBody } from 'reactstrap';
import {Form, FormGroup, Label, Input, Alert} from 'reactstrap';


import { AuthUserContext } from '../Session';
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
              <center><img style={{width: '50%', borderRadius: '50%'}}src={require('./splash.png')} /></center>
              </Col>
              </Row>
              <br />
              <AuthUserContext.Consumer>
                {authUser =>
                  authUser ? null : this.renderSignInButtons()
                }
              </AuthUserContext.Consumer>

            </Container>
        )
    }

    renderSignInButtons() {
      return (
        <Row>
          <Col>
            <center><Button outline color="secondary" href={ROUTES.SIGN_IN} size="lg" className="splashbuttons">Sign In</Button>{'  '}
            <Button outline color="secondary" href={ROUTES.SIGN_UP} size="lg" className="splashbuttons">Sign Up</Button></center>
          </Col>
        </Row>
      );
    }

}

export default compose(
    withFirebase
)(LandingPage);
