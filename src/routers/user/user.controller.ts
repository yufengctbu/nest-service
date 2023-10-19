import { Body, Controller, Post, Get, Query, Put } from '@nestjs/common';

import { IPayLoad } from '@app/shared/auth';
import { UserService } from './user.service';
import { User } from '@app/decorators/user.decorator';
import { UsePublicInterface } from '@app/decorators/public.decorator';
import { CaptchaInfoDto, GenerateCodeDto, ModifyUserPwdDto, RegisterUserDto, UserLoginDto } from './user.dto';

@Controller('user')
export class UserController {
    public constructor(private readonly userService: UserService) {}

    // 发送邮件验证码
    @UsePublicInterface()
    @Post('code')
    public async generateEmailCode(@Body() generateCodeInfo: GenerateCodeDto) {
        const { type, email } = generateCodeInfo;

        await this.userService.generateCode(type, email);
    }

    // 注册接口，无需进行登录验证
    @UsePublicInterface()
    @Post('register')
    public async registerUser(@Body() registerInfo: RegisterUserDto) {
        const { password, email, code } = registerInfo;

        await this.userService.registerUser(email, password, code);
    }

    // 修改密码
    @UsePublicInterface()
    @Put('password-reset')
    public async modifyUserPassword(@Body() modifyInfo: ModifyUserPwdDto) {
        const { password, email, code } = modifyInfo;

        await this.userService.modifyUserPassword(email, password, code);
    }

    // 登录验证码
    @UsePublicInterface()
    @Get('captcha')
    public loginCaptcha(@Query() captchaInfo: CaptchaInfoDto) {
        const { hashId, w, h, s, fs, bg } = captchaInfo;

        return this.userService.createCaptcha(hashId, w, h, s, fs, bg);
    }

    // 用户登录接口
    @UsePublicInterface()
    @Post('login')
    public userLogin(@Body() loginInfo: UserLoginDto) {
        return this.userService.login(loginInfo);
    }

    // 用户登出
    @Post('logout')
    public async userLogout(@User() userInfo: IPayLoad) {
        const { id, email } = userInfo;

        await this.userService.logout(id, email);
    }

    // 获取用户信息
    @Get('profile')
    public userProfile(@User() userInfo: IPayLoad) {
        const { id } = userInfo;

        return this.userService.queryUserProfile(id);
    }
}
