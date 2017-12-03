import React, { PropTypes } from 'react';
import { Link as LinkTo } from 'react-router';

const regexp = /^(https?:\/\/|#)/;

const Link = ({ to, target, label, onClick, children, leftIcon, className }) => {
  const isExternal = regexp.test(to);
  const CompTag = isExternal ? 'a' : LinkTo;
  let compProps = isExternal ? { href: to, target, className } : { to, className };

  compProps = { ...compProps, onClick, children, label };

  return (
    <CompTag {...compProps}>
      {leftIcon}
      {label}
      {children}
    </CompTag>
  );
};

const { string, oneOfType, object, any, func } = PropTypes;

Link.propTypes = {
  children: any,
  className: string,
  label: any,
  leftIcon: any,
  onClick: func,
  target: string,
  to: oneOfType([string, object]),
};

export default Link;
