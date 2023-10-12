import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { ManageModule } from './manage/manage.module';

@Module({
    imports: [UserModule, ManageModule],
})
export class RoutersModule {}
