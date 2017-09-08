import './App.css';

import React, { Component } from 'react'
import {
  Route,
  BrowserRouter as Router,
} from 'react-router-dom'

import 'react-notifications/lib/notifications.css';
import Clock from './components/Clock'
import Employee from './components/Employee'
import Home from './components/Home'
import JoinedProjectIndex from './components/JoinedProjectIndex'
import NavBar from './components/NavBar'
import ProjectIndex from './components/ProjectIndex'
import ProjectNew from './components/ProjectNew'
import ProjectShow from './components/ProjectShow'
import {NotificationContainer} from 'react-notifications'
// import createHistory from 'history/createBrowserHistory';
import {observer} from "mobx-react";
import state from './store/state';

// const history = createHistory();

// const ChangeTracker = withRouter(({match, location, history}) => {
//   console.log(match, location.pathname, location.state);
//   return false;
// });

@observer
class App extends Component {
  render() {
    return (
      <Router>
        <div className={`App ${this.getDayOrNightClass()}`}>

          {this.renderNavbar()}

          <div className="">

              <Route exact path="/" component={Home}/>

              <Route exact path="/projects" component={ProjectIndex} />
              <Route exact path="/new-project" component={ProjectNew} />
              <Route path="/projects/:id" component={ProjectShow}/>
              <Route path="/users/:id/joined" component={JoinedProjectIndex}/>
              <Route path="/companies/:id/users" component={Employee}/>

          </div>

          <Clock></Clock>
          <NotificationContainer />
        </div>
      </Router>
    )
  }

  renderNavbar() {
    if(state.hideNavbar) {
      return <div></div>;
    }
    return <NavBar location="/"></NavBar>;
  }

  getDayOrNightClass() {
    if(state.currentHour >= 9 && state.currentHour < 17) {
      return 'App--day'
    }
    return 'App--night'
  }

}

export default App
