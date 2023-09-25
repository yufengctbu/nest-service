import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { RegisterUserDto } from './user.dto';
import { UsePublicInterface } from '@app/decorators/public.decorator';

@Controller('user')
export class UserController {
    public constructor(private readonly userService: UserService) {}

    // 注册接口，无需进行登录验证
    @UsePublicInterface()
    @Post('register')
    public async registerUser(@Body() registerInfo: RegisterUserDto) {
        const { username, password, email } = registerInfo;

        await this.userService.registerUser(username, password, email);
    }
}
