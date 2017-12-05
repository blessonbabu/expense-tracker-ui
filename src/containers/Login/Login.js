import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Helmet from 'react-helmet';
import { GoogleLogin } from 'react-google-login';
import { updateLoader } from 'redux/modules/loader';
import { MenuButton, Notification } from 'components';

import { appRoutes, clientId } from 'config';

import styles from './Login.scss';

const { func, object } = PropTypes;

@connect(
  state => ({ user: state.auth.user, notification: state.auth.notification }),{ updateLoader }
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
    email: '',
    password: '',
    error: null,
  };

  componentDidMount = () => {
    this.props.updateLoader(false);
  }

  responseGoogle = (response) => {
  	console.log(response);
  	if(response.error) {
  		this.props.showMessage('error', 'Error Login Using Google');
  	} else {
      const { name } = response.profileObj;
      const { expires_at:expiresAt, id_token:idToken } = response.tokenObj;
      const { profile: {link} } = appRoutes;
      const { pathname } = this.props.location;
      console.log('profile ', response.profileObj);
      console.log('token ', response.tokenObj);
      localStorage.setItem('userexpiry', expiresAt);
      localStorage.setItem('user', JSON.stringify(response.tokenObj));
      localStorage.setItem('logFrom', 'google');
      if (pathname === '/')
        window.location.assign(link);
      else
        window.location.assign(pathname);
  	}
  }

  getRef = (input) => { this.email = input; }
  trackChange = name => event => this.setState({ [name]: event.target.value });

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('submitted succesfully ', this.state.email, this.state.password);
    localStorage.setItem('logFrom', 'expense-api');
  };

  render() {
    const { password, email, login, loginGoogle } = this.context.i18n;
    const { notification } = this.props;

    return (
      <div className={styles.loginWrapper}>
        <Helmet title="Login" />
        <form className={styles.loginForm} name="form" role="form" action="/api/auth/login" method="post">
          <div className={styles.loginHead}>Login</div>
          <div className={styles.formContainer}>
            <Notification {...notification} />
            <div className={classnames(styles.textInput, styles.loginInput)}>
              <label htmlFor="username">{email}</label>
              <i className={classnames(styles.formControlIcon, 'fa fa-user')} aria-hidden="true" />
              <input
                type="email"
                name="login_id"
                label={email}
                onChange={this.trackChange('email')}
                ref={this.getRef}
                required
              />
            </div>
            <div className={classnames(styles.textInput, styles.loginInput)}>
              <label htmlFor="password">{password}</label>
              <i className={classnames(styles.formControlIcon, 'fa fa-key')} aria-hidden="true" />
              <input
                name="password"
                label={password}
                type="password"
                onChange={this.trackChange('password')}
                required
              />
            </div>
            <div className={styles.buttonContainer}>
	           <MenuButton label={login} type="submit" className={styles.loginBtn} />
	          </div>
          </div>
          <div className={styles.googleContainer} >
          <GoogleLogin
            clientId={clientId}
            scope="email profile"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            buttonText={loginGoogle}
            isSignedIn={true}
          />
		  </div>
        </form>
      </div>
    );
  }
}
    	        
