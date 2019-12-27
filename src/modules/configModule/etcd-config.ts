import { Etcd3 } from 'etcd3';
import { Logger } from '@nestjs/common';
import { IConfig, sleep } from '@nestcloud/common';
import config from '../../config/config';
import { Store } from './store';
import { getFib } from '../../utils/getFib';
import { ConfigSyncException } from './config-sync.exception';

const PREFIX = `${process.env.NODE_ENV}:JSON:`;

export class EtcdConfig implements IConfig {
  private readonly store = Store;
  private readonly key: string;
  public readonly watchCallbacks: {
    [key: string]: Array<(value: any) => void>;
  } = {};
  private readonly hasDefined: { [key: string]: boolean } = {};
  private readonly retryInterval: 5000;
  private readonly retryLimit: 50;
  private retry = 0;
  private client = null;
  private watcher = null;
  private etcdConfig = null;
  private readonly logger = new Logger('ConfigModule');

  constructor(etcd: Etcd3, key: string) {
    this.etcdConfig = etcd;
    this.key = key;
  }

  async init() {
    while (this.retry <= this.retryLimit) {
      try {
        this.client = new Etcd3(this.etcdConfig).namespace(this.key || PREFIX);
        // 获取etcd配置中心配置
        const etcdConf = await this.client.getAll().json();
        this.store.data = Object.assign({}, config, etcdConf);
        this.createWatcher();
        this.logger.log('ConfigModule initialized');
        break;
      } catch (e) {
        this.logger.error(
          `Unable to initial ConfigModule ${this.retry} times, retrying...`,
          e,
        );
        await sleep(this.retryInterval * getFib(++this.retry));
      }
    }
  }

  /**
   * 注册配置中path的变更监听
   * @param path
   * @param callback
   */
  watch<T extends any>(
    path: string,
    callback: (data: T) => void = () => void 0,
  ) {
    if (!this.watchCallbacks[path]) {
      this.watchCallbacks[path] = [];
    }
    this.watchCallbacks[path].push(callback);

    if (!this.hasDefined[path]) {
      Object.defineProperty(this.store, path, {
        set: newVal => {
          this.watchCallbacks[path].forEach(cb => cb(newVal));
        },
      });
      this.hasDefined[path] = true;
    }
  }

  getKey(): string {
    return this.key;
  }

  /**
   *
   * @param path 需获取的config路径
   * @param defaults 如不存在返回的默认值
   */
  get<T extends any>(path?: string, defaults?): T {
    if (!path) {
      return this.store.data;
    }
    return this.store.get(path, defaults);
  }

  /**
   * 修改配置 并写入etcd 后台中编辑 业务逻辑中不建议修改配置
   * @param path
   * @param value
   */
  async set(path: string, value: any) {
    this.store.update(path, value);
    try {
      await this.client.put(path).value(value);
    } catch (e) {
      throw new ConfigSyncException(e.message, e.stack);
    }
  }

  putHandler(res) {
    let value;
    try {
      value = JSON.parse(res.value.toString());
    } catch (e) {
      Logger.error(e);
    }
    // tslint:disable-next-line:no-unused-expression
    value && (this.store[res.key.toString()] = value);
  }

  // 建立监听 实时获取修改的配置
  private createWatcher() {
    if (this.watcher) {
      this.watcher.end();
    }
    this.watcher = this.client
      .watch()
      .prefix('')
      .create();
    this.watcher
      .on('disconnected', () => this.logger.log('disconnected...'))
      .on('connected', () =>
        this.logger.log('successfully reconnected!', this.watcher.id),
      )
      .on('put', this.putHandler.bind(this))
      .on('connecting', () => this.logger.log(`connecting...:${new Date()}`))
      .on('error', e => Logger.error(e.message));
    this.logger.log(`[etcd_JSON_Watcher] init instance success:${config.hosts}`);
  }
}
