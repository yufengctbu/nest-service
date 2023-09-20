import { Controller, Get } from '@nestjs/common';

@Controller('page')
export class PageController {
    @Get()
    public async index() {
        return 'ok';
    }
}
