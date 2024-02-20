import React from "react";
import Swal from "sweetalert2";
import { APP, appConfig } from "./config.js";
import "firebase/auth";

export default class RegisterDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.clickRegister = this.clickRegister.bind(this);
    (this.makeLogin = this.makeLogin.bind(this)), (this.AUTH = null);

    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      typeInputPassword: "password",
      typeInputConfirmPassword: "password",
      eye: "show",
      eye2: "show",
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

  handleConfirmPassword(event) {
    this.setState({
      confirmPassword: event.target.value,
    });
  }

  clickRegister() {
    let self = this;

    if (
      !this.state.email ||
      !this.state.password ||
      this.state.password != this.state.confirmPassword
    ) {
      alert("All fields must be filled in or Password != Confirm Password!");
    } else {
      this.AUTH.createUserWithEmailAndPassword(
        this.state.email,
        this.state.password
      )
        .then((cred) => {
          console.log(cred.user);

          this.props.handleUidMain(cred.user.uid);
        })
        .catch((error) => {
          console.error(error);

          Swal.fire({
            icon: "error",
            text: error.message,
          });
        });
    }
  }

  makeLogin() {
    this.props.handleRegisterMain(0);
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
      this.clickRegister();
      event.preventDefault();
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Register</div>

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
                    <div className="form-group has-search">
                      <input
                        id="password"
                        type={this.state.typeInputPassword}
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
                            this.handleTypeInputPassword(
                              "typeInputPassword",
                              "eye"
                            );
                          }}
                        >
                          <span>{this.state.eye}</span>
                        </button>{" "}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-4 col-form-label text-md-right">
                    Confirm Password
                  </label>

                  <div className="col-md-6">
                    <div className="form-group has-search">
                      <input
                        id="password-confirm"
                        type={this.state.typeInputConfirmPassword}
                        className="form-control"
                        name="password_confirmation"
                        required
                        onChange={this.handleConfirmPassword}
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
                            this.handleTypeInputPassword(
                              "typeInputConfirmPassword",
                              "eye2"
                            );
                          }}
                        >
                          <span>{this.state.eye2}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group row mb-0">
                  <div className="col-md-6 offset-md-4">
                    <button
                      type="button"
                      className="btn btn-primary size"
                      onClick={this.clickRegister}
                    >
                      Register
                    </button>
                    <button className="btn btn-link" onClick={this.makeLogin}>
                      Login
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
