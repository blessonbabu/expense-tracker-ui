import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { access, mobileWidth } from 'config';
import translation from 'i18n';
import Loader from 'components/Loader/Loader';
import styles from './App.scss';
import Login from 'containers/Login/Login';

const { object, func } = PropTypes;

@connect(
  state => ({ user: state.auth.user}), {})
export default class App extends Component {
    static propTypes = {
        children: object,
        user: object,
    };

    static contextTypes = {
        store: object.isRequired
    };

    static childContextTypes = {
        user: object.isRequired,
        i18n: object,
    };

    state = {
        showLoader: false,
    };

    getChildContext() {
        return {
            user: this.props.user || {},
            i18n: translation,
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
        const { user, location } = this.props;
        console.log('location in app ', location);
        if (!user) {
            return (<Login location={location}/>);
        }
        return (
            <div className={styles.containerHeight} >
                SuccessFully Entered
                {this.props.children}
                <Loader />
            </div>
        );
    }
}
