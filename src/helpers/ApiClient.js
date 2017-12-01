import superagent from 'superagent';
import { adminApiBase } from 'config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? `/${path}` : path;

    if (/^https?:/.test(path)) {
        return path;
    }

    // Prepend `/api` to relative URL, to proxy to API server.
    return adminApiBase + adjustedPath;
}

export default class ApiClient {
    constructor(req) {
        methods.forEach((method) => {
            this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
                const request = superagent[method](formatUrl(path));
                const token = localStorage.getItem('useraccess');

                if (params) {
                    request.query(params);
                }

                if (__SERVER__ && req.get('cookie')) {
                    request.set('cookie', req.get('cookie'));
                }

                if (token) {
                    const expiry = localStorage.getItem('userexpiry');

                    request.set('Authorization', `Bearer ${token}`);
                    if (expiry < Date.now()) {
                        localStorage.clear();
                        reject({ status: 0, error_msg: 'Session expired. Please log in.' });

                        return;
                    }
                }

                if (data) {
                    request.send(data);
                }

                request.end((err, res) => {
                    const body = res && res.body || {};

                    if (err) {
                        const resp = body ? { ...body, statusCode: res && res.status } : err;

                        reject(resp);
                    } else {
                        resolve(body);
                    }
                });
            });
        });
    }

    empty() {} // eslint-disable-line class-methods-use-this
}
