import './ProjectShow.css'

import {Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis} from 'recharts';
import React, { Component } from 'react';

import { Link } from 'react-router-dom'
import _ from 'lodash';
import firebase from 'firebase';
import moment from 'moment';
import {observer} from "mobx-react";
import projects from '../store/projects';
import state from '../store/state';
import users from '../store/user';

const dummyData = [
  {name: "2017/7/6", uv: 400, pv: 2400, amt: 2400},
  {name: "2017/7/7", uv: 100, pv: 2400, amt: 2400},
  {name: "2017/7/8", uv: 600, pv: 2400, amt: 2400},
  {name: "2017/7/9", uv: 400, pv: 2400, amt: 2400},
  {name: "2017/7/10", uv: 300, pv: 2400, amt: 2400},
  {name: "2017/7/11", uv: 200, pv: 2400, amt: 2400},
  {name: "2017/7/12", uv: 100, pv: 2400, amt: 2400},
  {name: "2017/7/13", uv: 1000, pv: 2400, amt: 2400},
];
const SimpleAreaChart = React.createClass({
	render () {
    const valuationHistory = this.props.project.valuation_history;
    let data;
    if(!valuationHistory) {
      data = dummyData;
    } else {
      data = _.map(valuationHistory, (d, i) => {
        const date = moment().subtract(valuationHistory.length - i, 'days').format('YYYY/MM/DD')
        return {
          name: date,
          uv: d
        }
      });
    }


  	return (
    	<AreaChart width={350} height={200} data={data}
            margin={{top: 10, right: 30, left: 20, bottom: 0}}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Area type='monotone' dataKey='uv' stroke='#8884d8' fill='#8884d8' />
      </AreaChart>
    );
  }
})

@observer
class ProjectShow extends Component {
  constructor() {
    super();

    this.joinAsMember = this.joinAsMember.bind(this)
    this.removeMember = this.removeMember.bind(this)
  }

  render() {
    const project = _.find(projects, p => p.pid === this.props.match.params.id)

    if(!project) {
      return (
        <div>No project found</div>
      )
    }

    return (
      <div className="ProjectShow">
        <div className="projectshow-title">
          {project.title}
        </div>
        <div className="projectshow-img">
          <img src={project.image_url} alt={project.title}/>
        </div>
        <div className="projectshow-valuation">
          時価評価額：<span className="label-valuation projectshow-valuation">{`¥ ${project.valuation.toString().replace(/(\d)(?=(\d{3})+$)/g,'$1,')}`}</span>
        </div>
        <div className="projectshow-chart">
          <SimpleAreaChart project={project}/>
        </div>
        <div className="projectshow-startdate">
          開始日：{project.created_at}
        </div>
        <div className="projectshow-abstract">
          {project.abstract}
        </div>

        <div>
          <ul className="list-group">
            {_.map(project.members || [], (member, i) => {
              return (
                <li key={i} className="list-group-item">
                  {this.renderMember(member, i)}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="projectshow-owenerid">
          プロジェクトオーナー：{project.owner}<br />
          {/* プロジェクトメンバー：{project.members}  */}
        </div>
      </div>
    );
  }

  hasAlreadyRole() {
    const project = _.find(projects, p => p.pid === this.props.match.params.id)
    return !!_.find(project.members || [], member => state.currentUser && member.uid === state.currentUser.uid);
  }

  renderMember(member, key) {
    let button = '';
    const project = _.find(projects, p => p.pid === this.props.match.params.id)

    var sharedProjectValuation = Math.round(Number(member.stock_share.replace('%','') / 100) * project.valuation);

    if(!member.uid && !this.hasAlreadyRole()) {
      button = (
        <button className="btn btn-blue btn-block" onClick={(event) => this.joinAsMember(event, key, sharedProjectValuation)}>
          参加する
        </button>
      )
    } else if(state.currentUser && member.uid === state.currentUser.uid){
      button = (
        <button className="btn btn-danger btn-block" onClick={(event) => this.removeMember(event, key, sharedProjectValuation)}>
          やめる
        </button>
      )
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-3">
            {this.renderUserImage(member.uid)}
          </div>

          <div className="col-xs-6">
            {this.renderUserByUid(member.uid)}<br/>
            役割 {member.role}<br/>
            報酬株 {member.stock_share}<br/>
            現在評価額 ¥{sharedProjectValuation.toString().replace(/(\d)(?=(\d{3})+$)/g,'$1,')}
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6 col-xs-offset-3">
            {button}
          </div>
        </div>
      </div>
    )
  }

  renderUserImage(uid) {
    const user = _.find(users, u => u.uid === uid)

    if(!user) return ''

    return (
      <Link to={`/users/${user.uid}/joined`}>
        <img className="img-rounded"
          src={user.photoURL}
          alt="none"/>
      </Link>
    )
  }

  renderUserByUid(uid) {
    const user = _.find(users, u => u.uid === uid)

    if(!user) return <span className="label label-success">募集中</span>;

    return (
      <span>{user.name}</span>
    )
  }

  joinAsMember(event, memberIndex, spv) {
    event.preventDefault();
    const project = _.find(projects, p => p.pid === this.props.match.params.id)
    project.members[memberIndex].uid = state.currentUser.uid;

    if(state.currentUser.valuation) {
      state.currentUser.valuation = Number(state.currentUser.valuation) + Number(spv);
    } else {
      state.currentUser.valuation = Number(spv);
    }

    const updates = {};
    updates['/projects/' + this.props.match.params.id] = project;
    updates['/users/' + state.currentUser.uid + '/valuation'] = Number(state.currentUser.valuation);
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
  }

  removeMember(event, memberIndex, spv) {
    event.preventDefault();
    const project = _.find(projects, p => p.pid === this.props.match.params.id)
    project.members[memberIndex].uid = '';

    let userObject = _.find(users, u =>
      u.uid === state.currentUser.uid
    );

    if(state.currentUser.valuation) {
      state.currentUser.valuation = Number(state.currentUser.valuation) - Number(spv);
      if(state.currentUser.valuation <= 0) state.currentUser.valuation = 0;
    } else {
      state.currentUser.valuation = 0;
    }

    const updates = {};
    updates['/projects/' + this.props.match.params.id] = project;
    updates['/users/' + state.currentUser.uid + '/valuation'] = Number(state.currentUser.valuation);
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
  }
}

export default ProjectShow;
