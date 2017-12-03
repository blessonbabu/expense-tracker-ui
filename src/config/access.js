/**
 * This configuration is expected to be received from api call
 */

import appRoutes from './routes';

const { profile } = appRoutes;

const access = {
    'Super-User': {
        root: `/${profile.link}`,
        restrictions: [],
    },
    'Default': {
        root: `/${profile.link}`,
        restrictions: [],
    },
};

export default access;
