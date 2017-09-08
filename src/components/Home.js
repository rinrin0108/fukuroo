import './Home.css'

import React, { Component } from 'react';

import { Link } from 'react-router-dom'
import LoginButton from './LoginButton'
import {observer} from "mobx-react";
import projects from '../store/projects';
import state from '../store/state'
import {NotificationManager} from 'react-notifications'

@observer
class Home extends Component {
  render() {

    if(!state.currentUser) {
      return (
        <div className="Home">
          <img className="Home--img" src="/03_2_login_bg.png"/>
          <LoginButton></LoginButton>
        </div>
      )
    }

    return (
      <div className="Home">
        {this.renderWorkOrWake()}
      </div>
    );
  }

  componentWillMount() {
    // console.log(this.props, this.props.history, this.props.location, this.context.router)
    if(this.props.location.pathname === '/') {
      state.hideNavbar = true;
    } else {
      state.hideNavbar = false;
    }

  }

  renderWorkOrWake() {
    if(state.currentHour >= 9 && state.currentHour < 17) {
      return (
        <div className="top">
          <div className="top-image">
            <img className="Home--img" src="/01_top_logo_daytime.png" />
          </div>
          <div className="WakeOrWork">
            <img src="/01_top_btn_wake.png" />
          </div>
        </div>
      )

    } else {

      return (
        <div className="top">
          <div className="top-image">
            <img className="Home--img" src="/01_top_logo.png" />
          </div>
          <div className="WakeOrWork">
            <Link to='/projects'> <img src="/01_top_btn_work.png" /> </Link>
          </div>
        </div>
      )
    }

  }
}

export default Home;
