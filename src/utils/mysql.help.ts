import config from '../config/config';
import { join } from 'path';

const options = {
  type: 'mongodb',
  keepConnectionAlive: true,
  entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
  synchronize: false,
  logging: ['error'],
  extra: {
    connectionLimit: 3, // 连接池最大连接数量
  },
  // 配置项中配置优先级较高
  ...config.mongodb,
};

export function getOptions() {
  return options;
}
