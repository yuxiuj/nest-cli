import { HttpModule, Module } from '@nestjs/common';
import { AtopService } from '../../services/atop.service';

@Module({
  imports: [HttpModule],
  providers: [AtopService],
  exports: [AtopService],
})
export class AtopModule {
}
