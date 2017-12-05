import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Helmet from 'react-helmet';
import { GoogleLogin } from 'react-google-login';
import { updateLoader } from 'redux/modules/loader';
import { showMessage } from 'redux/modules/auth';
import { MenuButton, Notification } from 'components';

import { appRoutes, clientId } from 'config';

import styles from './Login.scss';

const { func, object } = PropTypes;

@connect(
  state => ({ user: state.auth.user, notification: state.auth.notification }),{ updateLoader, showMessage }
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

  componentDidMount = () => {
    this.props.updateLoader(false);
  }

  responseGoogle = (response) => {
  	// console.log(response);
  	if(response.error) {
  		this.props.showMessage('error', 'Error Login Using Google');
  	} else {
      const { name } = response.profileObj;
      const { expires_at:expiresAt, id_token:idToken } = response.tokenObj;
      const { profile: {link} } = appRoutes;
      const { pathname } = this.props.location;
      // console.log('profile ', response.profileObj);
      // console.log('token ', response.tokenObj);
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

  render() {
    const { loginGoogle } = this.context.i18n;
    const { notification } = this.props;

    return (
      <div className={styles.loginWrapper}>
        <Helmet title="Login" />
        <Notification {...notification} />
        <div className={styles.googleContainer} >
          <GoogleLogin
            clientId={clientId}
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            buttonText={loginGoogle}
          />
	      </div>
      </div>
    );
  }
}
    	        
