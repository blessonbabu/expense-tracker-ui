import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { access, mobileWidth, appRoutes, uiEndpoint, clientId } from 'config';
import translation from 'i18n';
import { Loader } from 'components';
import { GoogleLogout, GoogleLogin } from 'react-google-login';
import styles from './App.scss';
import { logout } from 'redux/modules/auth';
import Login from 'containers/Login/Login';

const { object, func } = PropTypes;

@connect(
  state => ({ user: state.auth.user}), { logout })
export default class App extends Component {
    static propTypes = {
        children: object,
        user: object,
        logout: func,
    };

    static contextTypes = {
        store: object.isRequired
    };

    static childContextTypes = {
        user: object.isRequired,
        i18n: object,
        location: object,
    };

    state = {
        showLoader: false,
    };

    getChildContext() {
        return {
            user: this.props.user || {},
            i18n: translation,
            location: this.props.location,
        };
    }

    componentDidMount() {
        const { logout } = this.props;

        const params = {
            client_id: clientId,
            cookie_policy: 'single_host_origin',
            fetch_basic_profile: true,
            ux_mode: 'popup',
            scope: 'profile email',
        }

        const myVar = setInterval(function(){
            if(window.gapi) {
                window.gapi.load('auth2', () => {
                    if (!window.gapi.auth2.getAuthInstance()) {
                        window.gapi.auth2.init(params).then(
                            res => {
                                const googleSignin = res.isSignedIn.Ab;
                                const loginFrom = localStorage.getItem("logFrom");
                                if (loginFrom === 'google' && !googleSignin) {
                                    logout();
                                    document.location.assign(`${appRoutes.logout.link}${uiEndpoint}`);
                                }
                            },
                            err => onFailure(err)
                        );
                    }
                })
                clearInterval(myVar);
            }
        }, 500);

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user && !nextProps.user) {
          // logout
            this.logoutApp();
            this.props.router.push('/');
        }
      }


    handleLogout = () => {
        this.logoutApp();
    }

    logoutApp = () => {
        const googleSignin = window.gapi.auth2.getAuthInstance().isSignedIn.Ab;
        const loginFrom = localStorage.getItem("logFrom");
        this.props.logout();
        if (loginFrom === 'google' && !googleSignin) {
            document.location.assign(`${appRoutes.logout.link}${uiEndpoint}`);
        }
    }

    render() {
        const { user, location } = this.props;
        if (!user) {
            return (<Login location={location}/>);
        }
        return (
            <div className={styles.containerHeight} >
                <div className={styles.app}>
                    <GoogleLogout
                        buttonText="Logout"
                        onLogoutSuccess={this.handleLogout}
                    />
                    {this.props.children}
                    <Loader />
                </div>
            </div>
        );
    }
}
