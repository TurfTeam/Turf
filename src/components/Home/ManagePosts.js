import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

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
                {posts.map(post => (
                    <li key={post.id}>
                        <span>
                            Content: {post.data().content}
                        </span>
                        <span>
                            Upvotes: {!!post.data().upvotes ? post.data().upvotes.length : 0}
                        </span>
                        <span>
                            Downvotes: {!!post.data().downvotes ? post.data().downvotes.length : 0}
                        </span>
                        <button onClick={() => {this.onDelete(post)}}>Remove</button>
                    </li>
                ))}
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
