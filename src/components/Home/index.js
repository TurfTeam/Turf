import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

class HomePage extends Component {
    constructor(props) {
      super(props);

      this.state = {
          loading: false,
          posts: [],
      };
    }

    componentDidMount() {
        this.setState({ loading: true });
        console.log("state: ", this.state);

        this.props.firebase.posts().get().then((querySnapshot) => {
            this.setState({
                loading: false,
                posts: querySnapshot.docs,
            })
        });
    }

    componentWillMount() {
        // this.props.firebase.posts().off();
    }

    render() {
        const { posts } = this.state;
        return (
            <div>
                <PostList posts={posts} />
            </div>
        )
    }
}

const PostList = ({ posts }) => (
    <ul>
        {posts.map(post => (
            <ul key={post.id}>
                <div class="card">
                <div class="card-body">
                <span>
                <h5 class="card-title"> Content: {post.data().content} </h5>
                </span>
                </div>
                <span>
                    Upvotes: {!!post.data().upvotes ? post.data().upvotes.length : 0}
                </span>
                <span>
                    Downvotes: {!!post.data().downvotes ? post.data().downvotes.length : 0}
                </span>
                <br></br>

                </div>
                <br></br>
            </ul>
        ))}
    </ul>
);

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition),
)(HomePage);
