import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';

@Module({
    providers: [EmailerService],
    exports: [EmailerService],
})
export class EmailerModule {}
