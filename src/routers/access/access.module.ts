import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { Access, AccessCategory } from '@app/entities';

@Module({
    imports: [TypeOrmModule.forFeature([Access, AccessCategory])],
    controllers: [AccessController],
    providers: [AccessService],
})
export class AccessModule {}
