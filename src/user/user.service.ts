import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { User } from '@prisma/client';
import { CreateUserDto } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
