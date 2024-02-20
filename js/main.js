import React from "react";
import ReactDOM from "react-dom";
import LoginDialog from "./login";
import RegisterDialog from "./register";
import NotesDialog from "./notes";

class MainDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleUid = this.handleUid.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      uid: localStorage.uid,
      register: 0, //or false...
    };
  }
  handleUid(uid) {
    this.setState({
      uid: uid,
    });

    localStorage.uid = uid;
  }
  handleLogout() {
    this.setState({
      uid: "",
      // register: 0,
    });

    localStorage.uid = "";
  }

  handleRegister(register) {
    this.setState({
      register: register,
    });
  }
  render() {
    return (
      <div>
        {this.state.uid ? (
          <NotesDialog
            uidMain={this.state.uid}
            handleLogoutMain={this.handleLogout}
          />
        ) : (
          <div>
            {this.state.register ? (
              <RegisterDialog
                handleRegisterMain={this.handleRegister}
                handleUidMain={this.handleUid}
              />
            ) : (
              <LoginDialog
                handleRegisterMain={this.handleRegister}
                handleUidMain={this.handleUid}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

const elem = document.querySelector("#app");

if (elem) {
  ReactDOM.render(<MainDialog />, elem);
}
