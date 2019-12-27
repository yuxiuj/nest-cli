export default {
  mysql: {
    host: '127.0.0.1',
    port: 3306,
    username: 'admin',
    password: 'testpw',
    database: 'test',
    synchronize: true,
  },
  etcd: {
    hosts: ['http://localhost:32772'],
  },
  jaeger: {
    // endpoint: 'http://jaeger-collector.fe-monitor.svc.cluster.local:14268/api/traces',
    endpoint: 'http://localhost:14268/api/traces',
  },
  kafka: {
    client: {
      brokers: ['localhost:9092'],
    },
  },
  redis: {
    host: 'localhost',
    port: 6379,
  },
  mongodb: {
    host: '127.0.0.1',
    port: 27017,
    database: 'test',
  },
  radar: [
    {
      APIUrl: 'https://openapi-daily.tuya-inc.cn',
      client_id: 'pyrxg9ged38jujj4st4n',
      secretKey: 'q7ymw5yvjwfr57eu85ea9m77dqf7ppxs',
      region: 'zh',
    }, {
      APIUrl: 'https://openapi-daily.tuya-inc.cn',
      client_id: 'pyrxg9ged38jujj4st4n',
      secretKey: 'q7ymw5yvjwfr57eu85ea9m77dqf7ppxs',
      region: 'hotel-saas',
    },
  ],
};
