import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { GoogleLogin } from 'react-google-login';
import classnames from 'classnames';
import { updateLoader } from 'redux/modules/loader';
import { showMessage, logout } from 'redux/modules/auth';
import { MenuButton } from 'components';

import { appRoutes, clientId } from 'config';
import { firebaseAuth } from "../../config/firebase";
import { login, resetPassword } from 'redux/modules/firebase';

import styles from './Login.scss';

const { func, object } = PropTypes;
const setErrorMsg = (error) => {
    return {
        loginMessage: error
    }
};

@connect(
  state => (
      {
          user: state.auth.user,
          notification: state.auth.notification
      }),
    { updateLoader, logout, showMessage }
  )
export default class Login extends Component {

  static propTypes = {
    notification: object,
    showMessage: func,
    updateLoader: func,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
      loginMessage: null,
  };

  componentDidMount = () => {
    this.props.updateLoader(false);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    const { pathname } = this.props.location;
    const { profile: {link} } = appRoutes;
    login(this.email.value, this.pw.value)
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('errorCode ', errorCode);
            console.log('errorMessage ', errorMessage);
            this.setState(setErrorMsg('Invalid username/password.'))
        });
  };

  resetPassword = () => {
    resetPassword(this.email.value)
        .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
        .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
  };

  responseGoogle = (response) => {
      console.log('response', response);
  	if(response.error) {
  		this.props.showMessage('error', 'Error Login Using Google');
  	} else {
      const { name } = response.profileObj;
      const { expires_at:expiresAt, id_token:idToken } = response.tokenObj;
      const { profile: {link} } = appRoutes;
      const { pathname } = this.props.location;
      localStorage.setItem('userexpiry', expiresAt);
      localStorage.setItem('user', JSON.stringify(response.tokenObj));
      localStorage.setItem('logFrom', 'google');
      if (pathname === '/')
        window.location.assign(link);
      else
        window.location.assign(pathname);
  	}
  };
  render() {
    const { loginGoogle } = this.context.i18n;
    const { notification } = this.props;
    const { password, email, login } = this.context.i18n;

      return (
          <div className={styles.loginWrapper}>
              <Helmet title="Login" />
              <form className={styles.loginForm}>
                  <div className={styles.loginHead}>Login</div>
                  <div className={styles.formContainer}>
                      <div className={classnames(styles.textInput, styles.loginInput)}>
                          <label htmlFor="username">{email}</label>
                          <i className={classnames(styles.formControlIcon, 'fa fa-user')} aria-hidden="true" />
                          <input
                              type="email"
                              name="login_id"
                              label={email}
                              ref={(email) => this.email = email}
                          />
                      </div>
                      <div className={classnames(styles.textInput, styles.loginInput)}>
                          <label htmlFor="password">{password}</label>
                          <i className={classnames(styles.formControlIcon, 'fa fa-key')} aria-hidden="true" />
                          <input
                              name="password"
                              label={password}
                              type="password"
                              ref={(pw) => this.pw = pw}
                          />
                      </div>
                      <div className={styles.footerContainer}>
                          <div className={styles.buttonContainer}>
                              <MenuButton label={login} type="submit" className={styles.loginBtn} onClick={this.handleSubmit} />
                          </div>
                          <div className={styles.googleContainer}>
                              <GoogleLogin
                                  clientId={clientId}
                                  onSuccess={this.responseGoogle}
                                  onFailure={this.responseGoogle}
                                  buttonText={loginGoogle}
                                  className={styles.loginBtn}
                              />
                          </div>
                      </div>
                      <a href="#" onClick={this.resetPassword} >Forgot Password?</a>
                  </div>
              </form>
          </div>
      );
  }
}
    	        
