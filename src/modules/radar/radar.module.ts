import { HttpModule, Module } from '@nestjs/common';
import { RadarService } from './radar.service';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [RadarService],
  exports: [RadarService],
})
export class RadarModule {
}
