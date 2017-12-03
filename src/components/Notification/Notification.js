import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './Notification.scss';

const { string, oneOf, bool } = PropTypes;

const Notification = ({ type, message, show }) => (
  <div className={classnames(styles.rootClass, styles[type], { [styles.hide]: !show })}>{message}</div>
);

Notification.propTypes = {
  message: string,
  show: bool,
  type: oneOf(['info', 'error', 'success']),
};
Notification.defaultProps = {
  type: 'info',
};

export default Notification;
