var userId = null;
// var domain_url = 'http://192.168.0.123:8080';
var domain_url = 'https://aperia.vellas.net:6640';
// var domain_url_sap = 'https://demo.vellas.net:94';
var domain_url_sap = 'https://aperia.vellas.net:6642';

export const setUser = (userData) => {
    userId = userData;
};

export const getUser = () => {
    return userId;
};

export const setDomain = (url) => {
    domain_url = url;
};
export const getDomain = () => {
    return domain_url;
};
export const getDomainSAP = () => {
    return domain_url_sap;
};