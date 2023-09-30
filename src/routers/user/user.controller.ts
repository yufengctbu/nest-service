import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { GenerateCodeDto, RegisterUserDto, UserLoginDto } from './user.dto';
import { UsePublicInterface } from '@app/decorators/public.decorator';

@Controller('user')
export class UserController {
    public constructor(private readonly userService: UserService) {}

    // 发送邮件验证码
    @UsePublicInterface()
    @Post('code')
    public async generateEmailCode(@Body() generateCodeInfo: GenerateCodeDto) {
        const { email } = generateCodeInfo;

        await this.userService.generateCode(email);
    }

    // 注册接口，无需进行登录验证
    @UsePublicInterface()
    @Post('register')
    public async registerUser(@Body() registerInfo: RegisterUserDto) {
        const { password, email, code } = registerInfo;

        await this.userService.registerUser(email, password, code);
    }

    // 用户登录接口
    @UsePublicInterface()
    @Post('login')
    public async userLogin(@Body() loginInfo: UserLoginDto) {
        const { email, password } = loginInfo;

        await this.userService.login(email, password);
    }
}
