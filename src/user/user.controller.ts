import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { RoleName } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { ChangePasswordDto } from './dto/change-password-user.dto';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';
import { profileInterface } from '../interfaces/profileInterface';
import { AuthenticatedRequest } from '../interfaces/authRequest';
import { ResponseWithoutDataInterface } from '../utils/response.utils';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  @Get('profile')
  @Roles(RoleName.PARENT)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: any): Promise<profileInterface> {
    const userId = req.user.sub;
    console.log('🚀 ~ UserController ~ getProfile ~ userId:', userId);

    if (!userId) {
      console.log('User ID not found in request');
      throw new BadRequestException('User ID not found in request');
    }
    return await this.profileService.findDetailsProfileById(userId);
  }

  @Put('profile/:id')
  @Roles(RoleName.PARENT)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<ResponseWithoutDataInterface> {
    console.log(req.user.sub);
    const result = await this.profileService.update(
      id,
      updateProfileDto,
      req.user.sub,
    );

    if (!result) {
      throw new BadRequestException(
        `profile with id ${id} not found or not authorized to update`,
      );
    }

    return {
      status: 'success',
      message: `Successfully updated profile with id ${id}`,
    };
  }

  // change password at first connexion
  @Post('change-password')
  async changePassword(@Body() ChangePasswordDto: ChangePasswordDto) {
    const { userId, newPassword } = ChangePasswordDto;

    // Vérifier si l'utilisateur existe
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Credentials not valid');
    }

    // Réception d'un nouveau mot de passe et hashage
    const hashedPassword = await this.userService.hashPassword(newPassword);

    // Mise à jour du mot de passe utilisateur
    await this.userService.updatePassword(userId, hashedPassword);

    // Réception des infos du profil mis à jour
    const updatedUser = await this.userService.findUserById(userId);

    // Réponse: Profil mis à jour avec succès
    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }
  @Get('profiles/school')
  @Roles(RoleName.PARENT) // Spécifiez les rôles nécessaires pour cette route
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  async getProfilesBySchool(
    @Request() req: any,
    @Query('skip') skipAsString = '0',
    @Query('take') takeAsString = '10',
  ) {
    const userId = req.user.sub;

    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }

    // Convert skip and take to integers
    const skip = parseInt(skipAsString, 10);
    const take = parseInt(takeAsString, 10);

    const profiles = await this.profileService.findProfilesByUserSchool(
      { skip, take },
      userId,
    );

    return { profiles };
  }
}
