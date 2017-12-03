import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Link from '../Link/Link';
import styles from './MenuButton.scss';

const { string, func, any, bool } = PropTypes;

const MenuButton = ({ link, label, className, leftIcon, rightIcon, primary, secondary, disabled, ...other }) => (
  <div className={classnames(styles.menubutton, className)}>
    {
      link
      ? <Link to={link} label={label} leftIcon={leftIcon} />
      : (
        <button className={classnames({ [styles.primary]: primary, [styles.secondary]: secondary, [styles.disabled]: !!disabled })} disabled={disabled} {...other}>
          {leftIcon}
          {label}
          {rightIcon}
        </button>
      )
     }
  </div>
);

MenuButton.propTypes = {
  className: string,
  disabled: bool,
  label: any,
  leftIcon: any,
  link: string,
  onClick: func,
  primary: bool,
  rightIcon: any,
  secondary: bool,
  value: string,
};

export default MenuButton;