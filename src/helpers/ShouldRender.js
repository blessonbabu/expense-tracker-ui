import { PropTypes } from 'react';

const { oneOfType, string, arrayOf, object, any } = PropTypes;

const ShouldRender = ({ role, children }, { user }) => {
    const { role: userRole } = user;

    if (role === userRole || role.length && role.indexOf(userRole) !== -1) {
        return children;
    }

    return null;
};

ShouldRender.propTypes = {
    children: any,
    role: oneOfType([string, arrayOf(string)]).isRequired,
};

ShouldRender.contextTypes = {
    user: object,
};

export default ShouldRender;
