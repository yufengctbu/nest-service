import { Controller, Get } from '@nestjs/common';
import { AccessService } from './access.service';

@Controller('access')
export class AccessController {
    public constructor(private readonly accessService: AccessService) {}

    @Get('category-list')
    public getCategoryList() {}
}
