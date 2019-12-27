import { get } from 'lodash';
import { Logger } from '@nestjs/common';
import { IConfig } from '@nestcloud/common';
import config from '../../config/config';

export class DefaultConfig implements IConfig {
  private store = {};
  private readonly key: string;
  private readonly logger = new Logger('DefaultConfigModule');

  async init() {
    this.store = Object.assign({}, config);
    this.logger.log('ConfigModule initialized');
  }

  /**
   * 注册配置中path的变更监听 读的文件配置无文件监听 有需求可以加 不存在变更
   * @param path
   * @param callback
   */
  watch<T extends any>(
    path: string,
    callback: (data: T) => void = () => void 0,
  ) {
    // doNothing
  }

  getKey(): string {
    return 'default';
  }

  /**
   *
   * @param path 需获取的config路径
   * @param defaults 如不存在返回的默认值
   */
  get<T extends any>(path?: string, defaults?): any {
    if (!path) {
      return this.store;
    }
    return get(this.store, path, defaults);
  }

  /**
   * 修改配置
   * @param path
   * @param value
   */
  async set(path: string, value: any) {
    this.store[path] = value;
  }
}
