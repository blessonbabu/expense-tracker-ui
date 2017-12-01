import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { access, mobileWidth } from 'config';
import translation from 'i18n';

const { object, func } = PropTypes;

export default class App extends Component {
    static propTypes = {
        children: object,
    };

    static contextTypes = {
        store: object.isRequired
    };

    static childContextTypes = {
        i18n: object,
    };

    getChildContext() {
        return {
            i18n: translation,
        };
    }

    render() {
        return (
            <div>Hello World</div>
        );
    }
}
