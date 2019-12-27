import * as Redis from 'ioredis';
import config from '../config/config';

const options = config.redis;
const redis = new Redis(config.redis);

/**
 * @param {boolean} create optional    - Create new redis optional
 * @param {object} opt - overwrite redis option optional
 * @return {Redis}
 */
export function getRedis(create?: boolean, opt = {}) {
  if (create) {
    return new Redis({ options, opt });
  }
  return redis;
}
