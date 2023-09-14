import { Controller, Get, Param } from '@nestjs/common';

@Controller('page')
export class PageController {
    @Get()
    public index() {
        return 'ok';
    }

    @Get(':name')
    public test(@Param() name: string) {
        return name;
    }
}
