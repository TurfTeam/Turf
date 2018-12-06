import React, { Component } from 'react';
import { compose } from 'recompose';
import { Container, Row, Col, Collapse } from 'reactstrap';
import { Card, Button, CardText, CardBody } from 'reactstrap';
import {Form, FormGroup, Label, Input, Alert} from 'reactstrap';

import { get } from 'geofirex';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

import firebase from 'firebase/app';
import 'firebase/firestore'

import * as ROUTES from '../../constants/routes';
import CreatePost from '../CreatePost';

class HomePage extends Component {
    constructor(props) {
      super(props);
      this.toggle = this.toggle.bind(this);
      this.state = {
          loading: false,
          posts: [],
          collapse: [],
          comments: [],
          newComments: [],
          visible: false
      };

      this.onReportDismiss = this.onReportDismiss.bind(this);
    }

    toggle(index) {
      console.log(this.state.collapse);
      this.state.newComments[index] = '';
      this.state.collapse[index] = !this.state.collapse[index];
      console.log(this.state.collapse);
      this.setState(this.state);
    }

    onReportClick(post) {
      this.props.firebase.doReport(post);
      this.state.visible = true;
      this.setState(this.state);
    }
    onReportDismiss() {
      this.state.visible = false;
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
            this.state.comments[doc.id] = doc.data();
          });
        });
        this.loadGeoPosts();
    }

    loadGeoPosts = () => {
      if ("geolocation" in navigator) {
        const geo_options = {
          enableHighAccuracy: true,
          maximumAge        : 30000,
          timeout           : 27000
        };

        navigator.geolocation.getCurrentPosition((pos) => {
          let posts = this.props.firebase.geoPosts(this.props.firebase.geo.point(pos.coords.latitude, pos.coords.longitude), 100, 'position');
          get(posts).then((filterdPosts) => {
            this.loadAllPosts(filterdPosts.map((p) => p.id));
          }).catch((err) => {
            this.loadAllPosts(null);
          });
        }, (e) => {
          let posts = this.props.firebase.geoPosts(this.props.firebase.geo.point(29.6516, -82.3248));
          get(posts).then((filterdPosts) => {
            this.loadAllPosts(filterdPosts.map((p) => p.id));
          }).catch((err) => {
            this.loadAllPosts(null);
          });
        }, geo_options);
      } else {
        let posts = this.props.firebase.geoPosts(this.props.firebase.geo.point(29.6516, -82.3248));
        get(posts).then((filterdPosts) => {
          this.loadAllPosts(filterdPosts.map((p) => p.id));
        }).catch((err) => {
          this.loadAllPosts(null);
        });
      }
    }

    loadAllPosts = (postIds) => {
      console.log(typeof(postIds));
      this.props.firebase.posts().get().then((querySnapshot) => {
        var count = 0;
        this.state.posts = [];
        querySnapshot.docs.forEach(doc => {
          if (!postIds || postIds.indexOf(doc.id) > -1) {
            count++;

            this.state.collapse[doc.id] = false;

            if (doc.data().upvotes && doc.data().downvotes) {
              doc.score = doc.data().upvotes.length - doc.data().downvotes.length;
            } else {
              doc.score = 0;
            }

            this.state.posts.push(doc);

            if ((!postIds && count === querySnapshot.docs.length) || count === postIds.length){
              this.state.loading = false;
              this.state.posts.sort((p1, p2) => p2.score - p1.score);
              this.setState(this.state);

              console.log("DONE: ",this.state);
            }
          }
        });
        console.log(this.state.posts);
      });
    }

    filterHot = () => {

    }

    filterNew = () => {

    }

    componentWillMount() {
        // this.props.firebase.posts().off();
    }

    onSubmitComment = (post) => {
      this.props.firebase.doPostComment(post, this.state.newComments[post.id], JSON.parse(localStorage.getItem("authUser")).uid, firebase.firestore.Timestamp.now());
      this.props.firebase.db.collection("comments")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach(doc => {
          this.state.comments[doc.id] = doc.data();
        });
      });
      this.state.newComments[post.id] = '';
      this.state.collapse[post.id] = false;
      this.setState({ posts: [], comments: this.state.comments, newComments: this.state.newComments, loading: this.state.loading, collapse: this.state.collapse, visible: this.state.visible });
      this.loadGeoPosts();

      this.state.collapse[post.id] = false;
      this.setState(this.state);

      // this.props.firebase.db.collection("posts")
      // .get()
      // .then((querySnapshot) => {
      //   this.state.newComments[post.id] = '';
      //   this.state.posts = querySnapshot.docs;

      //   this.setState(this.state);
      // });

    }

    upvote = postId => {
      const { posts } = this.state;
      let postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex >= 0) {
        let post = posts[postIndex];
        let currentUser = JSON.parse(localStorage.getItem("authUser")).uid;

        if (!!post.data().upvotes && post.data().upvotes.includes(currentUser)) {
          return;
        } else {
          if (!!post.data().downvotes && post.data().downvotes.includes(currentUser)) {
            post.data().downvotes = post.data().downvotes.filter(i => i !== currentUser);
            post.score += 1;
          }
          this.props.firebase.doUpvote(postId, currentUser);
          post.score += 1;
          document.getElementById(postId + '-score').textContent = post.score;
          document.getElementById(postId + '-up').className = 'active-vote';
          document.getElementById(postId + '-down').className = 'unactive-vote';
        }

        this.props.firebase.post(postId).get().then((doc) => {
          if (doc.data().upvotes && doc.data().downvotes) {
            doc.score = doc.data().upvotes.length - doc.data().downvotes.length;
          }
          posts[postIndex] = doc;
          this.setState(posts);
        });
      }
    }

    downvote = postId => {
      const { posts } = this.state;
      let postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex >= 0) {
        let post = posts[postIndex];
        let currentUser = JSON.parse(localStorage.getItem("authUser")).uid;

        if (!!post.data().downvotes && post.data().downvotes.includes(currentUser)) {
          return;
        } else {
          if (!!post.data().upvotes && post.data().upvotes.includes(currentUser)) {
            post.data().upvotes = post.data().upvotes.filter(i => i !== currentUser);
            post.score -= 1;
          }
          this.props.firebase.doDownvote(postId, currentUser);
          post.score -= 1;
          document.getElementById(postId + '-score').textContent = post.score;
          document.getElementById(postId + '-down').className = 'active-vote';
          document.getElementById(postId + '-up').className = 'unactive-vote';
        }

        this.props.firebase.post(postId).get().then((doc) => {
          if (doc.data().upvotes && doc.data().downvotes) {
            doc.score = doc.data().upvotes.length - doc.data().downvotes.length;
          }
          posts[postIndex] = doc;

          this.state.posts = posts;
          this.setState(this.state);
        });
      }
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
            <div id="homebackground">
            <div className="container" style={{paddingTop: "20px"}}>
            <div>
            <Alert color="danger" isOpen={this.state.visible} toggle={this.onReportDismiss}>
              You have reported a post. The administrators will review the post.
            </Alert>
            <CreatePost />
                {posts.map(this.createPostRender, this)}
            </div>
            </div>
            </div>
        )
    }

    createPostRender(post, index){
      let currentUser = JSON.parse(localStorage.getItem("authUser")).uid;
      let isUp = !!post.data().upvotes && post.data().upvotes.includes(currentUser);
      let isDown = !!post.data().downvotes && post.data().downvotes.includes(currentUser);
      let postToDate = post.data().created.toDate();
      let curToDate = firebase.firestore.Timestamp.now().toDate();

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
                    <span onClick={() => {this.onReportClick(post)}}>
                        <i className="fas fa-exclamation-circle"></i>
                    </span>
                  </Col>
                  <Col xs="2">
                    <span id={ post.id + '-up'} className={isUp ? 'active-vote' : 'unactive-vote'} onClick={() => { this.upvote(post.id) }}>
                        <i className="fas fa-chevron-up"></i>
                    </span>
                    <span className="text-right score" id={ post.id + "-score" }>
                        {/* {!!post.data().downvotes && !!post.data().upvotes ? post.data().downvotes.length - post.data().downvotes.length : 0} */}
                        { post.score ? post.score : 0 }
                    </span>
                    <span id={ post.id + '-down' } className={isDown ? 'active-vote' : 'unactive-vote'} onClick={() => { this.downvote(post.id) }}>
                        <i className="fas fa-chevron-down"></i>
                    </span>
                  </Col>
              </Row>
              <Row id="commentRow">
                  <span id = "icon">
                      <i className="fas fa-clock"></i>
                  </span>
                  <Col xs="2" id="time">
                      { this.printDate(curToDate, postToDate)}
                  </Col>
                  <Col>
              </Col>
              </Row>
              <Row>
                  <Collapse className="full-width" isOpen={this.state.collapse[post.id]}>
                  <hr />
                  <Col>
                    <Container fluid={true}>
                    <div>
                    {post.data().comments.length > 0 ? post.data().comments.map(this.createCommentsRender, this) : null}
                    </div>
                    <br></br>
                    <Card>
                    <CardBody>
                    <Form>
                      <FormGroup>
                        <Label for="comment">Add Comment</Label>
                        <Input type="textarea" name="comment" value={this.state.newComments[post.id]} onChange={this.onChangeComment.bind(this, post.id)} placeholder="Comment" />
                      </FormGroup>

                      <Button id="orangebtn" onClick={() => this.onSubmitComment(post)}>Submit</Button>
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

    printDate(curToDate, postToDate) {
        let postMinute = postToDate.getMinutes();
        let curMinute = curToDate.getMinutes();
        let postHour = postToDate.getHours();
        let curHour = firebase.firestore.Timestamp.now().toDate().getHours();
        let curDate = firebase.firestore.Timestamp.now().toDate().getDate();
        let postDate = postToDate.getDate();
        let postDay = postToDate.getDay();
        let curDay = postToDate.getDay();
        let inWeek = ((curDay - postDay >= 0) && (curDate - postDate < 7));
        let weekday=new Array(7);
        weekday[0]="Monday";
        weekday[1]="Tuesday";
        weekday[2]="Wednesday";
        weekday[3]="Thursday";
        weekday[4]="Friday";
        weekday[5]="Saturday";
        weekday[6]="Sunday";

        if(postDate == curDate) {
            if((curHour - postHour) == 0) {
                return ((curMinute - postMinute)) + " Min";
            }
            else if((curHour - postHour == 1) && (curMinute - postMinute < 0)) {
                return (((curMinute+60) - postMinute)) + " Min";
            }
            else {
                return ((curHour - postHour)) + " Hr";
            }
        }
        else if(inWeek) {
            return (weekday[postDay]);
        }
        else {
            return (postToDate.toLocaleDateString());
        }
    }

    createCommentsRender(comment, index){
      return (
      <Card key={comment} className="mt-3">
        <CardBody>
        {this.state.comments[comment].content}
        <div className="text-right" className="mt-3">
            {this.printDate(firebase.firestore.Timestamp.now().toDate(), this.state.comments[comment].created.toDate())}

            </div>
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
