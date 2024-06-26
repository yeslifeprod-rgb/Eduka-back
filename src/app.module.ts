import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

import { AddressModule } from './address/address.module';
import { ChildrenModule } from './children/children.module';
import { DisciplineModule } from './discipline/discipline.module';
import { EventModule } from './event/event.module';
import { MessageModule } from './message/message.module';
import { RoleModule } from './role/role.module';
import { SchoolModule } from './school/school.module';

import { EventTagModule } from './event_tag/event_tag.module';
import { ModifProfileModule } from './modifprofile/modifprofile.module';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
    PrismaModule,
    EventModule,
    ChildrenModule,
    RoleModule,
    SchoolModule,
    DisciplineModule,
    AddressModule,
    MessageModule,
    EventTagModule,
    ModifProfileModule,
    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


