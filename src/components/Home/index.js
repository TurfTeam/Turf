import React, { Component } from 'react';
import { compose } from 'recompose';
import { Container, Row, Col, Collapse } from 'reactstrap';
import { Card, Button, CardText, CardBody } from 'reactstrap';
import {Form, FormGroup, Label, Input} from 'reactstrap';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

class HomePage extends Component {
    constructor(props) {
      super(props);
      this.toggle = this.toggle.bind(this);
      this.state = {
          loading: false,
          posts: [],
          collapse: [],
          comments: [],
          newComments: []
      };
    }

    toggle(index) {
      console.log(this.state.collapse);
      this.state.newComments[index] = '';
      console.log(index);
      console.log(this.state.newComments[index]);
      this.state.collapse[index] = !this.state.collapse[index];
      console.log(this.state.collapse);
      this.setState(this.state);
    }

    componentDidMount() {
        this.setState({ loading: true });
        console.log("state: ", this.state);
        var comments = [];

        this.props.firebase.db.collection("comments")
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach(doc => {
            this.state.comments[doc.id] = doc.data().content;
          });
        });

        this.props.firebase.posts().get().then((querySnapshot) => {
            var count = 0;
            this.state.posts = querySnapshot.docs;

            querySnapshot.docs.forEach(doc => {
              count++;

              this.state.collapse[doc.id] = false;


              if(count === querySnapshot.docs.length){
                this.state.loading = false;
                this.setState(this.state);

                console.log("DONE: ",this.state);
              }

            });
        });
    }

    componentWillMount() {
        // this.props.firebase.posts().off();
    }

    onSubmitComment = (post) => {
      post.data().comments[post.id] = this.state.newComments[post.id];
      this.props.firebase.doPostComment(post, this.state.newComments[post.id], JSON.parse(localStorage.getItem("authUser")).uid);
      this.props.firebase.db.collection("comments")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach(doc => {
          this.state.comments[doc.id] = doc.data().content;
        });
      });

      this.props.firebase.db.collection("posts")
      .get()
      .then((querySnapshot) => {
        this.state.newComments[post.id] = '';
        this.state.posts = querySnapshot.docs;

        this.setState(this.state);
      });

    }

    onChange = event => {
      console.log(event);
      console.log(event.target.name);
      console.log(event.target.value);

      //this.setState({ [event.target.name]: event.target.value });
    };

    onChangeComment = (pid, event) => {
      console.log(pid);
      this.state.newComments[pid] = event.target.value;
      this.setState({ [this.state.newComments] : this.state.newComments});
      console.log(this.state.newComments[pid]);
      console.log(event.target.name);
      console.log(event.target.value);
    }

    render() {
        const { posts } = this.state;
        return (
            <div className="container">
            <div>
                {posts.map(this.createPostRender, this)}
            </div>
            </div>
        )
    }

    createPostRender(post, index){
      return (
      <Card className="card mt-3" key={post.id} id={post.id}>
          <CardBody>
              <Row>
                  <Col xs="7">
                    {post.data().content}
                  </Col>
                  <Col xs="2">
                    <span onClick={index => this.toggle(post.id)}>
                      <span style={{ whiteSpace: 'nowrap', marginRight: '5px', }}>{post.data().comments.length}</span>
                      <i className="fas fa-comment"></i>
                    </span>
                  </Col>
                  <Col xs="1">
                    <span onClick={() => {this.props.firebase.doPostComment(post.id, "YES", JSON.parse(localStorage.getItem("authUser")).uid)}}>
                        <i className="fas fa-exclamation-circle"></i>
                    </span>
                  </Col>
                  <Col xs="2">
                    <span onClick={() => {this.props.firebase.doPostComment(post.id, "YES", JSON.parse(localStorage.getItem("authUser")).uid)}}>
                        <i className="fas fa-chevron-up"></i>
                    </span>
                    <span className="text-right score">
                        {!!post.data().downvotes && !!post.data().upvotes ? post.data().downvotes.length - post.data().downvotes.length : 0}
                    </span>
                    <span onClick={() => {this.props.firebase.doPostComment(post.id, "YES", JSON.parse(localStorage.getItem("authUser")).uid)}}>
                        <i className="fas fa-chevron-down"></i>
                    </span>
                  </Col>
              </Row>
              <Row>
                  <Collapse className="full-width" isOpen={this.state.collapse[post.id]}>
                  <hr />
                  <Col>
                    <Container fluid={true}>
                    <div>
                    {post.data().comments.map(this.createCommentsRender, this)}
                    </div>
                    <Card>
                    <CardBody>
                    <Form>
                      <FormGroup>
                        <Label for="comment">Add Comment</Label>
                        <Input type="textarea" name="comment" value={this.state.newComments[post.id]} onChange={this.onChangeComment.bind(this, post.id)} placeholder="Comment" />
                      </FormGroup>

                      <Button onClick={() => this.onSubmitComment(post)}>Submit</Button>
                    </Form>
                    </CardBody>
                    </Card>
                    </Container>

                    </Col>
                  </Collapse>
              </Row>

          </CardBody>
      </Card>
    );
    }

    createCommentsRender(comment, index){
      console.log("comment: ",comment);
      return (
      <Card key={comment}>
        <CardBody>
          {this.state.comments[comment]}
        </CardBody>
      </Card>
    );
    }
}


const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition),
)(HomePage);
