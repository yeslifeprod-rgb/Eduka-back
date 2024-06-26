import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


import { ProfileService } from 'src/user/profile.service';
import { UserController } from 'src/user/user.controller';



@Module({
  providers: [ProfileService, PrismaService],
  controllers: [UserController], 
})
export class ModifProfileModule { }

// Peut être à modifier ou supprimer le fichier