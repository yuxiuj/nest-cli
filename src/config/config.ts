import * as zh from './zh';
import * as us from './us';

const config = new Map([
  ['zh', zh],
  ['us', us],
]);

const ENV = process.env.NODE_ENV || 'local';
const RG = process.env.REGION || 'zh';
// 防修改 默认国区本地
export default Object.freeze(config.get(RG)[ENV] || config.get('zh').local);
