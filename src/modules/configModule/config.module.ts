import { NEST_CONFIG_PROVIDER } from './constants';import { DynamicModule, Global, Module } from '@nestjs/common';import { IConfigOptions } from '../../interfaces/config-options.interface';import { EtcdConfig } from './etcd-config';import { DefaultConfig } from './default-config';import { IConfig } from '@nestcloud/common';import config from '../../config/config';@Global()@Module({})export class ConfigModule {  static register(options: IConfigOptions = {}): DynamicModule {    const inject = [];    const etcdConfigProvider = {      provide: NEST_CONFIG_PROVIDER,      useFactory: async (...args: any[]): Promise<IConfig> => {        // if (!options.key) {        //   throw new Error('Please set key when register module');        // }        if (options.key === 'etcd') {          const client = new EtcdConfig(config.etcd, options.namespace);          await client.init();          return client;        } else {          const client = new DefaultConfig();          await client.init();          return client;        }      },      inject,    };    return {      module: ConfigModule,      providers: [etcdConfigProvider],      exports: [etcdConfigProvider],    };  }}