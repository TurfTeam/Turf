import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

class ManagePostsPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          posts: [],
      };
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
            <div>
            <ul>
            <Row>
            <Col sm="6">
            <Card body>
                {posts.map(post => (
                    <ul key={post.id}>
                        <CardText>
                            Content: {post.data().content}
                        </CardText>
                        <Button onClick={() => {this.onDelete(post)}}>Remove</Button>
                    </ul>
                    ))}
                    </Card>
                    </Col>
                    </Row>
            </ul>
            </div>
        )
    }
}



const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition),
)(ManagePostsPage);
