import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import ReactDOM from 'react-dom';
import _ from 'lodash';
import firebase from 'firebase';
import {observer} from "mobx-react";
import state from '../store/state'
import users from '../store/user'

const provider = new firebase.auth.FacebookAuthProvider();
provider.setCustomParameters({
  'display': 'iframe'
});

@observer
class LoginButton extends Component {
  constructor() {
    super();

    this.state = {
      timeout: null
    }

    this.login = this.login.bind(this);
  }

  render() {
    if(!state.loginStateFetched) {
      return <div></div>
    }

    if(!state.currentUser) {
      return (
        <a style={{cursor: 'pointer'}} onClick={this.login}>
          <img src="/03_2_login_btn_login.png" alt="ログイン"/>
        </a>
      )
    }

    return <div></div>
  }

  componentDidUpdate() {
    const element = ReactDOM.findDOMNode(this);
    // console.log(element);
    element.onclick = this.login;
    // if(!state.currentUser) {
    //   if(this.state.timeout) {
    //     clearTimeout(this.state.timeout)
    //   };
    //   this.state.timeout = setTimeout(() => {
    //     this.login()
    //   }, 3000)
    // }
  }

  login() {
    // alert('ログインします');
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // This gives you a Facebook Access Token.
      // You can use it to access the Facebook API.
      // var token = result.credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      state.currentUser = user;
      console.log('logged in as', user)
      // alert('ログインできました')
      // this.setState({currentUser: user})

      // This will trigger in onAuthStateChanged so not needed
      // this.addIfNotExistingUser(user);

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;

      console.error('error', errorCode, errorMessage, email, credential)
      // alert('ログイン失敗しました', errorMessage)
    });
  }

}

export default LoginButton
