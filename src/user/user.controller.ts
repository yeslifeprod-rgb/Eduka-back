import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Put, Param, Get, Delete } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateModifProfileDto } from './dto/update-modifprofile.dto';



@Controller('user')
export class UserController {
  profileService: any;
  constructor(private readonly ProfileService: ProfileService) { }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateUserProfile(@Param('id') id: string, @Body() updateModifProfileDto: UpdateModifProfileDto) {
    return this.ProfileService.updateUserProfile(+id, updateModifProfileDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserProfile(@Param('id') id: string, @Body() updateModifProfileDto: UpdateModifProfileDto) {
    return this.ProfileService.getUserProfile(+id);
  }


  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteUserProfile(@Param('id') id: string, @Body() updateModifProfileDto: UpdateModifProfileDto) {
    return this.ProfileService.deleteUserProfile(+id);
  }


}

