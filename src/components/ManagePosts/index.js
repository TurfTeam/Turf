import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Container, Card, Button, CardTitle, CardBody, CardText, Row, Col, Alert } from 'reactstrap';

class ManagePostsPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          toggleView: false,
          posts: [],
      };
    }

    toggle = () => {
      this.state.toggleView = !this.state.toggleView;
      this.setState(this.state);
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.posts().where("reported", "==", true)
        .get()
        .then((querySnapshot) => {
            this.setState({
                loading: false,
                posts: querySnapshot.docs,
            })
        });
    }

    componentWillMount() {
        // this.props.firebase.posts().off();
    }

    onDelete(post){
      console.log("post index: ",this.state.posts.indexOf(post));
      this.state.posts.splice(this.state.posts.indexOf(post),1);
      this.setState(this.state);
      this.props.firebase.doPostRemove(post);
    }

    render() {
        const { posts } = this.state;
        return (
          <Container>
          <Row>
            <Col>
              <center><h2>Manage Posts</h2></center>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <Button onClick={this.toggle}>Toggle {this.state.toggleView ? "List View" : "Tile View"}</Button>
            </Col>
          </Row>
          <hr />
          {
            this.state.toggleView ? this.renderTileView() : this.renderListView()
          }
            </Container>
        )
    }

    renderTileView() {
      const { posts } = this.state;
      return (
        <Row>
              {posts.map(post => (
                <Col xs="6">
                <Card>
                  <CardBody>
                      <CardText>
                          Content: {post.data().content}
                      </CardText>
                      <Button onClick={() => {this.onDelete(post)}}>Remove</Button>
                      </CardBody>
                </Card>
                <br />
                </Col>
                  ))}
                  </Row>
      )
    }

    renderListView() {
      const { posts } = this.state;
      return (
        <div>
              {posts.map(post => (
                <Col>
                <Card>
                  <CardBody>
                      <CardText>
                          Content: {post.data().content}
                      </CardText>
                      <Button onClick={() => {this.onDelete(post)}}>Remove</Button>
                      </CardBody>
                </Card>
                <br />
                </Col>
                  ))}
      </div>
      )
    }
}



const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition),
)(ManagePostsPage);
