import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Access } from '@app/entities';

@Injectable()
export class AccessService {
    public constructor(@InjectRepository(Access) private readonly accessRepository: Repository<Access>) {}
}
