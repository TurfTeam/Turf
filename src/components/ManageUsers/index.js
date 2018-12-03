import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import { Container, Card, CardTitle, CardBody, CardText, Row, Col, Alert } from 'reactstrap';
import classnames from 'classnames';



class ManageUsersPage extends Component {
    constructor(props) {
      super(props);

      this.toggleTab = this.toggleTab.bind(this);
      this.toggleActiveView = this.toggleActiveView.bind(this);
      this.toggleBlacklistView = this.toggleBlacklistView.bind(this);

      this.state = {
          loading: false,
          users: [],
          blacklisted: [],
          activeTab: '1',
          toggleBlacklistView: false,
          toggleActiveView: false
      };
    }

    componentDidMount() {
      this.setState({ loading: true });

      this.props.firebase.db.collection("blacklist")
      .get()
      .then((querySnapshot1) => {
        var blacklistIDs = [];
        querySnapshot1.docs.forEach(doc => {
          blacklistIDs.push(doc.id);
        });
        this.props.firebase.users()
        .get()
        .then((querySnapshot) => {
          var users = [];
          var blacklisted = [];
          var count = 0;
            querySnapshot.docs.forEach(doc => {
              count++;
              console.log("doc: ",doc.id);
              if(blacklistIDs.indexOf(doc.id) === -1){
                console.log("doc: ",doc.data().email);
                console.log(blacklistIDs.indexOf(doc.id));
                users.push(doc);
              }
              else{
                blacklisted.push(doc);
              }

              if(count === querySnapshot.docs.length){
                this.state.users = users;
                this.state.blacklisted = blacklisted;
                this.state.loading = false;

                this.setState(this.state);

              }
            });
            });
            /*

            console.log(this.state.users);
            console.log(this.state.users[0].id);
            console.log(this.state.users[0].data().email);*/
        });
      }

    componentWillUnmount() {
    }

    toggleTab(tab) {
      if (this.state.activeTab !== tab) {
        this.state.activeTab = tab;
        this.setState(this.state);
      }
    }

    toggleBlacklistView() {
      this.state.toggleBlacklistView = !this.state.toggleBlacklistView;
      this.setState(this.state);
    }

    toggleActiveView() {
      this.state.toggleActiveView = !this.state.toggleActiveView;
      this.setState(this.state);
    }

    onBlacklist(user){
      this.state.users.splice(this.state.users.indexOf(user),1);
      this.state.blacklisted.push(user);
      this.setState(this.state);
      this.props.firebase.doBlackListUser(user);
    }

    onRestorePrivileges(user){
      this.state.blacklisted.splice(this.state.blacklisted.indexOf(user),1);
      this.state.users.push(user);
      this.setState(this.state);
      this.props.firebase.doRestoreUserPrivileges(user);
    }

    render() {
    const { users, blacklisted } = this.state;

    return (
        <div id="homebackground" style={{paddingTop: "20px"}}>
      <Container>
      <Row>
        <Col>
        <center><h2 id="signheader">Manage Users</h2></center>

        </Col>
      </Row>
      <Nav tabs>
        <NavItem>
          <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
            Active
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
            Blacklisted
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="1">
          <Container>
          <hr />
          <Row>
            <Col>
              <Button id="orangebtn" onClick={this.toggleActiveView}>Toggle {this.state.toggleActiveView ? "List View" : "Tile View"}</Button>
            </Col>
          </Row>
          <hr />
          {this.state.toggleActiveView ? this.renderActiveTileView() : this.renderActiveListView() }
          </Container>
        </TabPane>
        <TabPane tabId="2">
        <Container>
        <hr />
        <Row>
          <Col>
            <Button id="orangebtn" onClick={this.toggleBlacklistView}>Toggle {this.state.toggleBlacklistView ? "List View" : "Tile View"}</Button>
          </Col>
        </Row>
        <hr />
        {this.state.toggleBlacklistView ? this.renderBlacklistTileView() : this.renderBlacklistListView() }
        </Container>
        </TabPane>
      </TabContent>
      </Container>
        </div>
    );
  }

  renderActiveListView = () => {
    const { users } = this.state;
    return (
      <div>
            {users.map(user => (
              <Col>
              <Card>
                <CardBody>
                    <CardText>
                        Email: {user.data().email}
                        <br />
                        Role: {user.data().email === "admins@turf.com" ? "admin" : user.data().role}
                        <br />
                        Posts: {user.data().posts.length}
                    </CardText>
                    <Button  id="orangebtn" onClick={() => {this.onBlacklist(user)}}>Blacklist</Button>
                    </CardBody>
              </Card>
              <br />
              </Col>
                ))}
    </div>
    )
  }

  renderActiveTileView = () => {
    const { users } = this.state;
    return (
      <Row>
            {users.map(user => (
              <Col xs="6">
              <Card>
                <CardBody>
                    <CardText>
                    Email: {user.data().email}
                    <br />
                    Role: {user.data().email === "admins@turf.com" ? "admin" : user.data().role}
                    <br />
                    Posts: {user.data().posts.length}
                    </CardText>
                    <Button  id="orangebtn" onClick={() => {this.onBlacklist(user)}}>Blacklist</Button>
                    </CardBody>
              </Card>
              <br />
              </Col>
                ))}
                </Row>
    )
  }

  renderBlacklistListView = () => {
    const { blacklisted } = this.state;
    return (
      <div>
            {blacklisted.map(user => (
              <Col>
              <Card>
                <CardBody>
                    <CardText>
                    Email: {user.data().email}
                    <br />
                    Role: {user.data().email === "admins@turf.com" ? "admin" : user.data().role}
                    <br />
                    Posts: {user.data().posts.length}
                    </CardText>
                    <Button  id="orangebtn" onClick={() => {this.onRestorePrivileges(user)}}>Restore Privileges</Button>
                    </CardBody>
              </Card>
              <br />
              </Col>
                ))}
    </div>
    )
  }

  renderBlacklistTileView = () => {
    const { blacklisted } = this.state;
    return (
      <Row>
            {blacklisted.map(user => (
              <Col xs="6">
              <Card>
                <CardBody>
                    <CardText>
                    Email: {user.data().email}
                    <br />
                    Role: {user.data().email === "admins@turf.com" ? "admin" : user.data().role}
                    <br />
                    Posts: {user.data().posts.length}
                    </CardText>
                    <Button  id="orangebtn" onClick={() => {this.onRestorePrivileges(user)}}>Restore Privileges</Button>
                    </CardBody>
              </Card>
              <br />
              </Col>
                ))}
                </Row>
    )
  }

}




const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition),
)(ManageUsersPage);
