import * as React from 'react';
import { getApiURI } from '../../common/server';
import { Card, HTMLTable, Button, ButtonGroup } from '@blueprintjs/core';
import { withRouter, RouteComponentProps } from 'react-router';
import { IUser } from 'common/interfaces';

interface IStudentHomeProps extends RouteComponentProps {
}

interface IStudentHomeState {
  userProfile?: IUser;
  // groupMembers: Array<{}>;
  stakeholder: IStakeholderInfo;
  students: Array<IStudentInfo>;
  project: IProject;
  isLoading: boolean;
}
interface IStudentInfo {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface IStakeholderInfo {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
}

interface IProject {
  projectId: number;
  projectName: string;
  members: Array<IStudentInfo>;
}
var x = 'd';

class StudentHome extends React.Component<IStudentHomeProps, IStudentHomeState> {

  state: IStudentHomeState = {
    userProfile: undefined,
    stakeholder: { userId: 0, firstName: '', lastName: '', email: '', organization: '' },
    students: [],
    project: { projectId: 0, projectName: '', members: [] },
    isLoading: false,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });

    try {
      const response = await fetch(getApiURI('/users/') + sessionStorage.getItem('email'));
      const data = await response.json();

      this.setState({
        userProfile: data,
        isLoading: false
      });
    } catch (e) {
      console.error(e);
    }

    try {
      const response = await fetch(getApiURI('/projects/student/') + sessionStorage.getItem('email'));

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const data = await response.json();

      this.setState({
        project: data,
        isLoading: false
      });
    } catch (e) {
      console.error(e);
    }

    try {
      const response = await fetch(getApiURI('/projects/') + this.state.project.projectId + '/students');
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();

      console.log('/projects/:projectId/students', data);

      this.setState({
        students: data
      });
    } catch (e) {
      console.error(e);
    }

    try {
      const response = await fetch(getApiURI('/projects/') + this.state.project.projectId + '/stakeholder');
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();

      this.setState({
        stakeholder: data
      });
    } catch (e) {
      console.error(e);
    }

    /*
            var request = new XMLHttpRequest();
            request.withCredentials = true;
            request.open('POST', 'http://localhost:8080/getProjectByUser/');
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            var data = 'getproject';
            request.setRequestHeader('Cache-Control', 'no-cache');
            request.send(data);
    
            var that = this;
            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    var response = request.responseText;
                    if (response != null) {
                        var jsonResponse = JSON.parse(response);
                        var stakeholderNameLiteral = 'stakeholderName';
                        that.setState({
                            stakeholder: jsonResponse[stakeholderNameLiteral], 
                            isLoading: false
                        });
                    }
                }
            }; */
  }

  render() {
    return (
      <div className="csci-container">

        <div className="csci-side">
          <Card>
            {this.state.userProfile !== undefined ? (
              <div>
                <h2>{this.state.userProfile.firstName} {this.state.userProfile.lastName}</h2>

                <ul>
                  <li>{this.state.userProfile.email}</li>
                  <li>{this.state.userProfile.phone}</li>
                </ul>

                <Button text="Edit" icon="edit" />
              </div>
            ) : 'Loading...'}
          </Card>

          <Card>
            <h2>Actions</h2>
            <ButtonGroup vertical={true} fill={true} alignText="left" large={true}>
              <Button text="Submit Deliverable" disabled={true} />
              <Button text="Submit Weekly Status Report" onClick={() => this.props.history.push('/student/weeklyreport')} />
              <Button text="Submit Peer Review Form" onClick={() => this.props.history.push('/student/peerreview')} />
              <Button text="Submit Stakeholder Review Form" disabled={true} />
            </ButtonGroup>
          </Card>
        </div>

        <div className="csci-main">
          <Card>
            <h2>Team Contact Information</h2>
            <HTMLTable bordered={true} striped={true}>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>

                </tr>
              </thead>
              <tbody>
                {this.state.students.map((student: IStudentInfo) =>
                  <tr key={student.userId}>
                    <td> {student.firstName} </td>
                    <td> {student.lastName} </td>
                    <td> {student.email} </td>
                  </tr>
                )}
              </tbody>
            </HTMLTable>
          </Card>

          <Card>
            <h2>Stakeholder Contact Information</h2>
            <HTMLTable bordered={true} striped={true}>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Organization</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.stakeholder.firstName}</td>
                  <td>{this.state.stakeholder.lastName}</td>
                  <td>{this.state.stakeholder.email}</td>
                  <td>{this.state.stakeholder.organization}</td>
                </tr>
              </tbody>
            </HTMLTable>
          </Card>
        </div>
      </div>
    );
  }
}

export default withRouter(StudentHome);
