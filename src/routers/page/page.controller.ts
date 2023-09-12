import { Controller, Get, Logger } from '@nestjs/common';

@Controller('page')
export class PageController {
    @Get()
    public index() {
        Logger.log('hwat ifdife');
        Logger.error('error!!!!!!!!!!!!!!!!');
        return 'ok';
    }
}
