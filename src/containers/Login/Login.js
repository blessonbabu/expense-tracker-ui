import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Helmet from 'react-helmet';
import { updateLoader } from 'redux/modules/loader';
import { loginGoogle } from 'redux/modules/auth';
import { MenuButton } from 'components';
import { GoogleLogin } from 'react-google-login';

import styles from './Login.scss';

const { func, object } = PropTypes;

@connect(
  state => ({ user: state.auth.user }), { updateLoader, loginGoogle }
)
export default class Login extends Component {

  static propTypes = {
  	loginGoogle: func,
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
  		console.log('error found');
  	} else {
  		const { name } = response.profileObj;
      const { expires_at:expiresAt, id_token:idToken } = response.tokenObj;
  		console.log('id_token ', idToken);
      console.log('expires_at ', expiresAt);
  		console.log('name ', name);
      console.log('profile ', response.profileObj)
      // localStorage.setItem('userexpiry', expiresAt);
      // localStorage.setItem('user', JSON.stringify(response.tokenObj));
      // console.log('location ', this.props.location);
      // window.location.assign(this.props.location.pathname);
  		// this.props.loginGoogle(idToken, expiresAt);
  	}
  }

  getRef = (input) => { this.email = input; }
  trackChange = name => event => this.setState({ [name]: event.target.value });

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('submitted succesfully ', this.state.email, this.state.password);
  };

  render() {
    const { password, email, login, loginGoogle } = this.context.i18n;

    return (
      <div className={styles.loginWrapper}>
        <Helmet title="Login" />
        <form className={styles.loginForm} name="form" role="form" action="/api/auth/login" method="post">
          <div className={styles.loginHead}>Login</div>
          <div className={styles.formContainer}>
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
  			    clientId="697372493571-oq4lckprdun7dqiimsobf0us6k84e71i.apps.googleusercontent.com"
  			    buttonText={loginGoogle}
  			    onSuccess={this.responseGoogle}
  			    onFailure={this.responseGoogle}
			     />
		  </div>
        </form>
      </div>
    );
  }
}
    	        
