import daily from './env/daily';
import local from './env/local';
import pre from './env/pre';
import prod from './env/prod';

const env = { daily, local, pre, prod };
const currentEnvConfig = env[process.env.NODE_ENV || 'local'];

export default Object.freeze(currentEnvConfig);
