import { HttpService, Injectable, Logger, Scope } from '@nestjs/common';
// 替换为redisClient？
import { getRedis } from '../utils/getRedis';
import * as crypto from 'crypto';
import * as qs from 'querystring';
import { RedisClient } from 'redis';
import config from '../config/config';
import { omit, pick } from 'lodash';
import { API_GET_TOKEN, API_REFRESH_TOKEN, TOKEN_EXPIRE_CODE, DAILY_RADAR_URL } from '../modules/radar/constans';

// 构造测试用当前时间
// Reflect.defineProperty(Date, 'now', { value: () => 1575337387932 });

interface RadarConfig {
  APIUrl: string;
  client_id: string;
  secretKey: string;
  access_token?: string;
  refresh_token?: string;
}

/**
 * tuya开房平台接口服务
 * https://docs.tuya.com/zh/iot/open-api/tuya-open-platform-access-guide/simple-grant#%E8%BF%94%E5%9B%9E%E7%BB%93%E6%9E%9C
 */
@Injectable()
export class RadarService {
  private refreshToken: string;
  private accessToken: string;
  private redisClient: RedisClient;
  private readonly radarClients: Map<any, any>;

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.radarClients = new Map();
    this.redisClient = getRedis();
    this.init().then();
    // this.getToken().then(() => this.logger.log('init accessToken'));
  }

  private readonly radarConfig: object[] = config.radar;
  private readonly logger = new Logger('radar');
  /**
   * daily 环境中逻辑存在某些区别 本地以日常接口进行测试
   */
  private readonly isDaily = ['daily', 'local', undefined].includes(process.env.NODE_ENV);

  /**
   *
   */
  async init(): Promise<void> {
    await Promise.all(this.radarConfig.map(async (conf: any): Promise<object> => {
      this.radarClients.set(conf.region, omit(conf, 'region'));
      return this.getToken(conf.region);
    }));
    // 设置一个默认区域 （好像无对应需求）
    // Reflect.defineProperty(this.radarClients, 'customGet',
    //   { value: (key, defaultKey) => this.radarClients.get(key) || this.radarClients.get(defaultKey) });
  }

  /**
   * 选择radar服务对应区域
   * @param region
   */
  request(region) {
    const self = this;
    /**
     *
     * @param meta
     * @param method
     * @param api
     * @param data
     * @param query
     */
    return async (meta, method, api, data = {}, query?) => {
      const headers = self.makeRequestHeader(region, meta);
      const url = self.makeRequestPath(region, api, query, meta);
      this.logger.log(headers, 'headers');
      this.logger.log(url, 'url');
      try {
        const result = await self.httpService.request({
          method,
          url,
          data,
          headers,
        }).toPromise();
        const { data: resData } = result;
        // token过期场景
        if (+resData.code === TOKEN_EXPIRE_CODE) {
          await self.tokenRefresh(region);
          return self.request(region)(meta, method, api, data, query);
        }
        return resData;
      } catch (e) {
        self.logger.error(e);
        return { success: false, msg: `Request Error :: ${e.message}` };
      }
    };
  }

  /**
   * 刷新accessToken
   * @param {string} region
   */
  async tokenRefresh(region) {
    const t = Date.now();
    const conf: RadarConfig = this.radarClients.get(region);
    const sign = this.getSignature(region, true, t);

    const api = `${conf.APIUrl}${API_REFRESH_TOKEN}/${conf.refresh_token}`;
    const headers = {
      client_id: conf.client_id,
      sign,
      sign_method: this.isDaily ? 'MD5' : 'HMAC-SHA256',
      t,
    };
    const maybeOk = await this.httpService.get(api, { headers }).toPromise();

    if (maybeOk.data.success) {
      const { result: tokens } = maybeOk.data;
      Object.assign(conf, tokens);
      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      return { success: true };
    } else if (+maybeOk.data.code === TOKEN_EXPIRE_CODE) {
      try {
        await this.getToken(region);
      } catch (e) {
        return { success: false, msg: e };
      }
    }
  }

  /**
   * 获取accessToken
   * @param {string} region
   */
  async getToken(region: string): Promise<{ access_token: string, refresh_token: string }> {
    const conf = this.radarClients.get(region);
    if (conf.access_token) {
      return pick(conf, ['access_token', 'refresh_token']);
    }
    // 日常特殊处理
    const api = this.isDaily ? DAILY_RADAR_URL : `${conf.APIUrl}${API_GET_TOKEN}`;
    const t = Date.now();
    const sign = this.getSignature(region, true, t);
    const headers = {
      client_id: conf.client_id,
      sign,
      sign_method: this.isDaily ? 'MD5' : 'HMAC-SHA256',
      t,
    };
    const maybeOk = await this.httpService.get(api, { headers }).toPromise();
    if (maybeOk.data.success) {
      const result = maybeOk.data.result;
      // 维护access_token
      Object.assign(conf, result);
      return result;
    } else {
      throw new Error(`GET_TOKEN_FAILD ${maybeOk.data.code}, ${maybeOk.data.msg}`);
    }
  }

  /**
   * 构建radarHeader
   * @param region
   * @param meta
   */
  makeRequestHeader(region: string, meta: any = {}) {
    const t = Date.now();
    const sign = this.getSignature(region, false, t);
    const header: any = {
      client_id: this.radarClients.get(region).client_id,
      access_token: this.radarClients.get(region).access_token,
      lang: meta.lang || 'en',
      sign,
      sign_method: this.isDaily ? 'MD5' : 'HMAC-SHA256',
      t,
    };
    if (meta.apiRegion) {
      header.region = meta.apiRegion;
    }
    return header;
  }

  /**
   * 获取请求path
   * @param region
   * @param base
   * @param query
   * @param meta
   */
  makeRequestPath(region, base, query, meta) {
    const endpoint = meta.endpoint || this.radarClients.get(region).APIUrl;
    if (query) {
      return `${endpoint}${base}?${qs.stringify(query)}`;
    } else {
      return `${endpoint}${base}`;
    }
  }

  /**
   * token获取前签名算法
   * sign = HMAC-SHA256(client_id + t, secret).toUpperCase()
   * token获取后签名算法
   * sign = HMAC-SHA256(client_id + access_token + t, secret).toUpperCase()
   * @param {string} region
   * @param {boolean} isPre
   * @param {number}t
   */
  getSignature(region: string, isPre: boolean, t: number) {
    const conf: RadarConfig = this.radarClients.get(region);
    if (this.isDaily) {
      return this.sign(region, `${conf.client_id}${isPre ? '' : conf.access_token}${conf.secretKey}${t}`);
    }
    return this.sign(region, `${conf.client_id}${isPre ? '' : conf.access_token}${t}`);
  }

  /**
   * 日常md5 其他hmac-sha256
   * @param {string} region
   * @param {string}str
   * @return {string} sign
   */
  private sign(region, str: string): string {
    if (this.isDaily) {
      // 开放平台历史遗留问题
      return crypto
        .createHash('md5')
        .update(str, 'utf8')
        .digest('hex')
        .toUpperCase();
    } else {
      return crypto
        .createHmac('sha256', this.radarClients.get(region).secretKey)
        .update(str, 'utf8')
        .digest('hex')
        .toUpperCase();
    }
  }
}
