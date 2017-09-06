import './NavBar.css'

import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import LoginButton from './LoginButton'
import _ from 'lodash';
import firebase from 'firebase';
import {observer} from "mobx-react";
import state from '../store/state';
import users from '../store/user';

@observer
class NavBar extends Component {
  render() {
    if(!state.loginStateFetched || state.hideNavBar) {
      return <div></div>
    }

    if(!state.currentUser) {
      return (
        <div></div>
        // <LoginButton></LoginButton>
      )
    }

    let userObject = _.find(users, d =>
      d.email === state.currentUser.email
    );
    if(!userObject) {
      userObject = state.currentUser;
    }

    // 動作不安定
    var path = "/";
    var backpath = "/projects";
    switch(true) {
      case /projects\/*/.test(path):
        backpath = "/projects";
        break;
      case /projects/.test(path):
        backpath = "/";
        break;
      case /new-project/.test(path):
        backpath = "/projects";
        break;
      case /users\/*\/joined/.test(path):
        backpath = "/projects";
        break;
      case /companies\/*\/users/.test(path):
        backpath = "/";
        break;
      default:
        break;
    }

    const currentUserBlock =
      <div className="navbar-icon-area">
          <Link to={`/users/${state.currentUser.uid}/joined`}>
          <img
            className="img-circle"
            alt={userObject.email}
            src={userObject.photoURL}/>
          </Link>
      </div>;

    return (
      <div className="container NavBar">
        <div className="navbar-area">
          <div className="navbar-button-area">
            <Link to={backpath}><img className="icon-arrow" src="../../arrow_for_list_r.png" alt="<" /></Link>
          </div>

          <div className="navbar-lavel-area">
            <label>現在の総評価額</label>
            <label className="label-valuation">¥ {(state.currentUser.valuation ? Math.round(state.currentUser.valuation) : 0).toString().replace(/(\d)(?=(\d{3})+$)/g,'$1,')}</label>
          </div>

          {currentUserBlock}

          <hr/>
        </div>
      </div>
    )
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      // navigated!
    }
  }
}

export default NavBar
