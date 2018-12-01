import React, { Component } from 'react';
import { compose } from 'recompose';
import { Container, Row, Col, Collapse } from 'reactstrap';
import { Card, Button, CardText, CardBody, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Glyphicon } from 'react-bootstrap';

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

        this.props.firebase.posts().get().then((querySnapshot) => {
            var count = 0;
            this.state.posts = querySnapshot.docs;

            querySnapshot.docs.forEach(doc => {
              count++;

              this.state.collapse[doc.id] = false;

              this.props.firebase.db.collection("comments").where("pid", "==", doc.id)
              .get()
              .then(function(commentsList){
                comments[doc.id] = commentsList.docs;
              });

              if(count === querySnapshot.docs.length){
                this.state.comments = comments;
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

    onSubmit = event => {

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
      const comment = this.state.newComments[post.id];
      return (
      <Card className="card mt-3" key={post.id} id={post.id}>
          <CardBody>
              <Row>
                  <Col xs="7">
                    {post.data().content}
                  </Col>
                  <Col xs="1">
                  <Glyphicon glyph="comment" onClick={index => this.toggle(post.id)}></Glyphicon>

                  </Col>
                  <Col xs="1">
                  <Glyphicon glyph="exclamation-sign" onClick={() => {this.props.firebase.doPostComment(post.id, "YES", JSON.parse(localStorage.getItem("authUser")).uid)}}></Glyphicon>
                  </Col>
                  <Col xs="1">
                  <Glyphicon glyph="thumbs-up" onClick={() => {this.props.firebase.doPostComment(post.id, "YES", JSON.parse(localStorage.getItem("authUser")).uid)}}></Glyphicon>
                  <Glyphicon glyph="thumbs-down" onClick={() => {this.props.firebase.doPostComment(post.id, "YES", JSON.parse(localStorage.getItem("authUser")).uid)}}></Glyphicon>

                  </Col>
                  <Col xs="1">
                      <div className="text-right">
                        {!!post.data().downvotes && !!post.data().upvotes ? post.data().downvotes.length - post.data().downvotes.length : 0}
                      </div>
                  </Col>
                  <Collapse isOpen={this.state.collapse[post.id]}>
                  <hr />
                  <Row>
                  <Col xs="12">
                    <Container>
                    <Card>
                    <CardBody>
                    <Form>
                      <FormGroup>
                        <Label for="comment">Add Comment</Label>
                        <Input type="textarea" name="comment" value={this.state.newComments[post.id]} onChange={this.onChangeComment.bind(this, post.id)} placeholder="Comment" />
                      </FormGroup>

                      <Button onClick={() => this.props.firebase.doPostComment(post.id, this.state.newComments[post.id], JSON.parse(localStorage.getItem("authUser")).uid)}>Submit</Button>
                    </Form>
                    </CardBody>
                    </Card>
                    </Container>

                    </Col>
                    </Row>
                  </Collapse>
              </Row>
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
