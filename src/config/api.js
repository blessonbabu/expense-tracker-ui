/**
 * Api server enpoint
 */
export const adminApiBase = 'http://dev.seemymachines.com:8080';
export const uiEndpoint = 'http://localhost:6070';

/**
 * adminApi
 */
const admin = {
    authLogin: `${adminApiBase}/auth/login`,
};

// All endpoints
const endPoints = {
    ...admin,
};

export const generateURL = (key, ...params) => {
    let url = endPoints[key];
    const isDynamic = typeof url === 'object';
    const dynamicParams = isDynamic && url.params;

    url = isDynamic && url.base || url;

    if (params.length) {
        params.forEach((param, index) => {
            const connection = index === 0 ? '' : '&';

            if (param === undefined || param === null) {
                return;
            }
            url = isDynamic ? `${url}${connection}${dynamicParams[index]}=${param}` : url.replace(`{${index}}`, param);
        });
    }

    return url;
};
