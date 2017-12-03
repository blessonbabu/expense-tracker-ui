import { adminApiBase, generateURL } from './api';
import appRoutes from './routes';

/**
 * Required as Karma doesn't support some of the new features
 * of JavaScript by itself. eg: Promise
 */

const environment = {
    development: {
        isProduction: false
    },
    production: {
        isProduction: true
    }
}[process.env.NODE_ENV || 'development'];
const mobileWidth = 960;

const configuration = {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT,
    appRoutes,
    app: {
        title: 'Expense Tracker',
        description: 'Expense Tracker',
        head: {
            titleTemplate: 'Expense Tracker: %s',
            meta: [
                { name: 'description', content: 'Expense Tracker' },
                { charset: 'utf-8' },
                { property: 'og:site_name', content: 'Expense Tracker' },
                { property: 'og:image', content: 'http://www.qburst.com/images/responsive/QBlogo.svg' },
                { property: 'og:locale', content: 'en_US' },
                { property: 'og:title', content: 'Expense Tracker' },
                { property: 'og:description', content: 'Expense Tracker' },
                { property: 'og:card', content: 'summary' },
                { property: 'og:site', content: '@qburst' },
                { property: 'og:creator', content: '@qburst' },
                { property: 'og:image:width', content: '200' },
                { property: 'og:image:height', content: '200' }
            ]
        },
        footer: 'Copyright (c) 2017 Expense Tracker. All Rights Reserved',
    },
    adminApiBase,
    generateURL,
    mobileWidth,
    ...environment,
};

export default configuration;
