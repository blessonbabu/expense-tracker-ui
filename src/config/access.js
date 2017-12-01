/**
 * This configuration is expected to be received from api call
 */

import appRoutes from './routes';

const { profile } = appRoutes;

const access = {
    'Super-User': {
        root: `/${profile.link}`,
    },
    'Default': {
        root: `/${profile.link}`,
    },
};

export default access;
