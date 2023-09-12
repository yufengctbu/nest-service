import { Controller, Get, Logger, Param } from '@nestjs/common';

@Controller('page')
export class PageController {
    @Get()
    public index() {
        Logger.log('hwat ifdife');
        Logger.error('error!!!!!!!!!!!!!!!!');
        return 'ok';
    }

    @Get(':name')
    public test(@Param() name: string) {
        return name;
    }
}
