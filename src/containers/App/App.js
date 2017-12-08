import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GoogleLogout, GoogleLogin } from 'react-google-login';

import translation from 'i18n';
import { access, mobileWidth, appRoutes, uiEndpoint, clientId } from 'config';
import { firebaseAuth } from "../../config/firebase";
import { logout } from 'redux/modules/auth';
import { Loader } from 'components';
import Login from 'containers/Login/Login';

import styles from './App.scss';

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
        const { logout, location } = this.props;
        const { profile: {link} } = appRoutes;

        const params = {
            client_id: clientId,
            cookie_policy: 'single_host_origin',
            fetch_basic_profile: true,
            ux_mode: 'popup',
            scope: 'profile email',
        };

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

        firebaseAuth().onAuthStateChanged((user) => {
            const userA = user;
            console.log('user outside ', userA);
            if (userA) {
               console.log('user inside', userA);
               const userJson = JSON.parse(atob(userA.pa.split('.')[1]));
               const expires = parseInt(userJson.exp, 10) * 1000;
               const userAuth = {
                   token_type: "Bearer",
                   expires_at: expires,
                   id_token: userJson
               };
               localStorage.setItem('userexpiry', userJson.exp);
               localStorage.setItem('user', JSON.stringify(userAuth));
               localStorage.setItem('logFrom', 'firebase');
               console.log('pathname', location.pathname);
               // if (location.pathname === '/')
               //     window.location.assign(link);
               // else
               //     window.location.assign(location.pathname);
           }
        });

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user && !nextProps.user) {
            localStorage.clear();
            document.location.assign(`${appRoutes.logout.link}${uiEndpoint}`);
        }
      }


    handleLogout = () => {
        localStorage.clear();
        document.location.assign(`${appRoutes.logout.link}${uiEndpoint}`);
    };

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
