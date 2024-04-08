let config = {};

switch (process.env.REACT_APP_ENV) {
    case 'development':
        config = require('./config/development').default;
        break;
    default:
        throw new Error('Unsupported environment');
}

export default config;