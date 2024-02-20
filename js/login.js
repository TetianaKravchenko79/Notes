import React from "react";
import { APP, appConfig } from "./config.js";
import "firebase/auth";

export default class LoginDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.clickLogin = this.clickLogin.bind(this);

    this.makeRegister = this.makeRegister.bind(this);

    this.AUTH = null;

    this.state = {
      email: "",
      password: "",
      type: "password",
      eye: "show",
    };
  }

  componentDidMount() {
    appConfig();
    this.AUTH = APP.auth();
  }

  handleEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handlePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  clickLogin() {
    let self = this;

    if (this.state.email && this.state.password) {
      this.AUTH.signInWithEmailAndPassword(
        this.state.email,
        this.state.password
      )
        .then((cred) => {
          console.log(cred.user);

          this.props.handleUidMain(cred.user.uid);
        })
        .catch((error) => {
          console.error(error);

          alert("Incorrect login or password!");
        });
    } else {
      alert("All fields must be filled in!");
    }
  }
  makeRegister() {
    this.props.handleRegisterMain(1);
  }

  handleTypeInputPassword(eventState, typeState) {
    if (
      this.state[eventState] == "password" &&
      this.state[typeState] == "show"
    ) {
      this.setState({
        [eventState]: "text",
        [typeState]: "hide",
      });
      e.preventDefault();
    } else {
      this.setState({
        [eventState]: "password",
        [typeState]: "show",
      });
      e.preventDefault();
    }
  }

  onKeyPressHandler(event) {
    if (event.key == "Enter") {
      console.log("Pressed Enter!!!");
      this.clickLogin();
      event.preventDefault();
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Login</div>
              <div className="card-body">
                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    E-Mail Address
                  </label>

                  <div className="col-md-6">
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      name="email"
                      required
                      onChange={this.handleEmail}
                      onKeyDown={(event) => {
                        this.onKeyPressHandler(event);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    Password
                  </label>

                  <div className="col-md-6">
                    <input
                      id="password"
                      type={this.state.type}
                      className="form-control"
                      name="password"
                      required
                      onChange={this.handlePassword}
                      onKeyDown={(event) => {
                        this.onKeyPressHandler(event);
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn"
                        onClick={() => {
                          this.handleTypeInputPassword("type", "eye");
                        }}
                      >
                        <span>{this.state.eye}</span>
                      </button>{" "}
                    </div>
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <div className="col-md-8 offset-md-4">
                    <button
                      type="button"
                      className="btn btn-primary size"
                      onClick={this.clickLogin}
                    >
                      Login
                    </button>
                    <button
                      className="btn btn-link"
                      onClick={this.makeRegister}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
