import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { access, mobileWidth } from 'config';
import translation from 'i18n';
import { Notification, Loader } from 'components';
import styles from './App.scss';
import Login from 'containers/Login/Login';

const { object, func } = PropTypes;

@connect(
  state => ({ user: state.auth.user, notification: state.auth.notification}), {})
export default class App extends Component {
    static propTypes = {
        children: object,
        notification: object,
        user: object,
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

    componentWillReceiveProps(nextProps) {
        if (!this.props.user && nextProps.user) {
          // login
          this.props.pushState(access[nextProps.user.role].root);
        } else if (this.props.user && !nextProps.user) {
          // logout
          this.props.pushState('/');
        }
      }

    render() {
        const { user, location, notification } = this.props;
        console.log('location in app ', location);
        if (!user) {
            return (<Login location={location}/>);
        }
        return (
            <div className={styles.containerHeight} >
                <Notification {...notification} />
                {this.props.children}
                <Loader />
            </div>
        );
    }
}
