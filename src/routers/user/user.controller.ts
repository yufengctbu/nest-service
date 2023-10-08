import { Body, Controller, Post, Get, Query } from '@nestjs/common';

import { IPayLoad } from '@app/routers/auth';
import { UserService } from './user.service';
import { User } from '@app/decorators/user.decorator';
import { UsePublicInterface } from '@app/decorators/public.decorator';
import { CaptchaInfoDto, GenerateCodeDto, RegisterUserDto, UserLoginDto } from './user.dto';

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

    // 登录验证码
    @UsePublicInterface()
    @Get('captcha')
    public loginCaptcha(@Query() captchaInfo: CaptchaInfoDto) {
        const { w, h, s, fs, bg } = captchaInfo;

        return this.userService.createCaptcha(w, h, s, fs, bg);
    }

    // 用户登录接口
    @UsePublicInterface()
    @Post('login')
    public userLogin(@Body() loginInfo: UserLoginDto) {
        return this.userService.login(loginInfo);
    }

    // 获取用户信息
    @Get('profile')
    public userProfile(@User() userInfo: IPayLoad) {
        const { id } = userInfo;

        return this.userService.queryUserProfile(id);
    }
}
