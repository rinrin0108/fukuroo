import './ProjectIndex.css';

import React, { Component } from 'react';

import { Link } from 'react-router-dom'
import _ from 'lodash';
import firebase from 'firebase';
import { observer } from "mobx-react";
import projects from '../store/projects';
import state from '../store/state';
import users from '../store/user';

@observer
class JoinedProjectIndex extends Component {
  renderUserInfo() {
    const user = firebase.auth().currentUser;
    if(user){
      const name = this.renderUserName(user.email);
      return (
        <div className="user-info">
          <img className="img-circle" src={user.photoURL} />
          <div>{name}</div>
        </div>
      );
    } else return '';
  }

  renderUserName(email) {
    const usersRef = firebase.database().ref("users")
    let name;
    //usersRef.equalTo(email).on('value', (snapshot) => {
    usersRef.on('value', (snapshot) => {
      const users = snapshot.val()
      const user = _.find(users, u => u.email === email);
      name = user.name;
      console.log(user.name);
    })
    return name;
    //console.log(user.name);
    /*
    usersRef.on('value', (snapshot) => {
      usersRef.off('value');
      const users = snapshot.val()
      console.log(users);
      const exist = _.find(users, u => u.email === email);
      if(exist){
        user = exist.name;
        //console.log(user);
        return
      }
    })
    console.log(user);
    return 'a';//user.name;
    */
  }

  render() {
    const list = _.map(projects, (project) => {
      return (
        <div className="project-container" key={project.pid}>
          <div className="image-area-joined">
            <img className="icon-owner" src="../../05_jolined_project_list_icon_owner.png" alt=">" />
            <img className="image-project" src={project.image_url} alt="icon" />
          </div>
          <div className="row">
            <div>{`¥${project.valuation}`}</div>
            <div>{project.title}</div>
            <div>{`${project.abstract.substring(0,25)}...`}</div>
          </div>
          <div className="button-area-joined">
            <img className="icon-image-area" src="../../05_jolined_project_list_icon_up.png" alt=">" />
            <Link to={`/projects/${project.pid}`}><img className="icon-image-area" src="../../btn_ list_arrow.png" alt=">" /></Link>
          </div>
        </div>
      );
    })

    return (
      <div className="App">
        { this.renderUserInfo() }
        <div className="list-container">
          {list}
        </div>
        <div className="flex-create-project">
          <Link to="/new-project"><img id="create-project" src="../../05_jolined_project_list_btn_add_progect.png" alt=">" /></Link>
        </div>
      </div>
    );
  }
}

export default JoinedProjectIndex;
