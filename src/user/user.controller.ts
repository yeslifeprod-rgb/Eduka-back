import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Put, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateModifProfileDto } from './dto/update-modifprofile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';



  @Controller('user')
export class UserController {
  constructor(private readonly modifProfileService: ProfileService) { }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateUserProfile(@Param('id') id: string, @Body() updateModifProfileDto: UpdateModifProfileDto) {
    return this.modifProfileService.updateUserProfile(+id, updateModifProfileDto);
  }
}

