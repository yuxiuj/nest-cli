import {
  DNSHealthIndicator,
  TypeOrmHealthIndicator,
  TerminusModuleOptions,
  TerminusModule,
} from '@nestjs/terminus';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOptions } from '../utils/mysql.help';

const getTerminusOptions = (
  db: TypeOrmHealthIndicator,
  dns: DNSHealthIndicator,
): TerminusModuleOptions => ({
  endpoints: [
    {
      // The health check will be available with /health
      url: '/health',
      // All the indicator which will be checked when requesting /health
      healthIndicators: [
        // Set the timeout for a response to 300ms
        async () => db.pingCheck('database', { timeout: 300 }),
        async () =>
          dns.pingCheck('dns check', 'https://www.baidu.com', {
            timeout: 300,
          }),
      ],
    },
  ],
});

@Module({
  imports: [
    // Make sure TypeOrmModule is available in the module context
    TypeOrmModule.forRoot(getOptions()),
    TerminusModule.forRootAsync({
      // Inject the TypeOrmHealthIndicator provided by nestjs/terminus
      inject: [TypeOrmHealthIndicator, DNSHealthIndicator],
      useFactory: (db, dns) => getTerminusOptions(db, dns),
    }),
  ],
})
export class HealthModule {}
