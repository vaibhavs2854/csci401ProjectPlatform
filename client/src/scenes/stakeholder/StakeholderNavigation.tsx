import * as React from 'react';
import {
  Route,
  RouteComponentProps,
  withRouter
} from 'react-router-dom';
import {
  LinkContainer
} from 'react-router-bootstrap';
import Home from './Home/index';
import Profile from './Profile/index';
import ProjectProposal from './ProjectProposal/index';
import ProjectPage from './ProjectPage/index';
import autobind from 'autobind-decorator';
import { Navbar, Alignment, Button, Tabs, Tab, TabId } from '@blueprintjs/core';
const logo = require('../../svg/logo.svg');

interface IStakeholderProps extends RouteComponentProps<any> {
}
interface IStakeholderState {
  currentProject: number;
  navbarTabId: TabId;
}

class StakeholderNavigation extends React.Component<IStakeholderProps, IStakeholderState> {

  state: IStakeholderState = {
    currentProject: 0,
    navbarTabId: 'home',
  };

  @autobind
  inferNavbarTabId() {
    const mappings = [
      {
        pathname: '/stakeholder/proposals',
        navbarTabId: 'proposals',
      },
      {
        pathname: '/stakeholder/profile',
        navbarTabId: 'profile',
      },
    ];

    for (const mapping of mappings) {
      if (this.props.location.pathname.startsWith(mapping.pathname)) {
        return mapping.navbarTabId;
      }
    }

    return 'home';
  }

  @autobind
  logOutClicked() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('userType');

    this.props.history.push('/');
  }

  @autobind
  async handleNavbarTabChange(navbarTabId: TabId) {
    this.setState({ navbarTabId });
    switch (navbarTabId) {
      case 'home':
        this.props.history.push('/stakeholder');
        break;
      case 'profile':
        this.props.history.push('/stakeholder/profile');
        break;
      case 'proposals':
        this.props.history.push('/stakeholder/proposals');
        break;
      default:
        this.props.history.push('/stakeholder');
    }
  }

  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Group>
            <Navbar.Heading>
              <img src={logo} id="csci-logo" alt="logo" />
            </Navbar.Heading>
          </Navbar.Group>

          <Navbar.Group align={Alignment.RIGHT}>
            <Button onClick={this.logOutClicked} icon="log-out" text="Log Out" minimal={true} />
          </Navbar.Group>

          <Navbar.Group align={Alignment.CENTER}>
            <div id="csci-navbar-tabs">
              <Tabs
                id="navtabs-admin"
                animate={true}
                large={true}
                onChange={this.handleNavbarTabChange}
                selectedTabId={this.state.navbarTabId}
              >
                <Tab id="home" title="Home" />
                <Tab id="profile" title="Profile" />
                <Tab id="proposals" title="Proposals" />
              </Tabs>
            </div>
          </Navbar.Group>
        </Navbar>
        <div className="content">
          <Route exact={true} path="/stakeholder" component={Home} />
          <Route path="/stakeholder/profile" component={Profile} />
          <Route path="/stakeholder/proposals" component={ProjectProposal} />
          <Route path="/stakeholder/project/:projectId" handler={ProjectPage} component={ProjectPage} />
        </div>
      </div>
    );
  }
}

export default withRouter(StakeholderNavigation);