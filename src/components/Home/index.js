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
            <div class="container">
                <PostList posts={posts} />
            </div>
        )
    }
}

const PostList = ({ posts }) => (
    <div>
        {posts.map(post => (
            <div class="card mt-3" key={post.id}>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm"> {post.data().content} </div>
                        <div class="col-sm">
                            <div class="text-right">
                                {!!post.data().downvotes && !!post.data().upvotes ? post.data().downvotes.length - post.data().downvotes.length : 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition),
)(HomePage);
