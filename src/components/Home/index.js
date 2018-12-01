import React, { Component } from 'react';
import { compose } from 'recompose';
import { Container, Row, Col, Collapse } from 'reactstrap';
import { Card, Button, CardText, CardBody, Glyphicon } from 'reactstrap';

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
          comments: []
      };
    }

    toggle(index) {
      console.log(this.state.collapse);
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
                var postComment = {
                  pid: doc.id,
                  commentsList: commentsList.docs
                }

                comments.push(postComment);
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
                  <Col xs="1">
                    <span onClick={index => this.toggle(post.id)}>
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
                  <Collapse isOpen={this.state.collapse[post.id]}>
                    <Card>
                        <CardBody>
                        Anim pariatur cliche reprehenderit,
                        enim eiusmod high life accusamus terry richardson ad squid. Nihil
                        anim keffiyeh helvetica, craft beer labore wes anderson cred
                        nesciunt sapiente ea proident.
                        </CardBody>
                    </Card>
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
