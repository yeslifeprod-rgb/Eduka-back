import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateModifProfileDto } from './dto/update-modifprofile.dto';



@Injectable()
export class ProfileService {
  private users = [
    {
      id: 1,
      parents: {
        firstName: 'OldFirstName',
        lastName: 'OldLastName',
        email: 'old.email@example.com',
      },
      children: [
        {
          firstName: 'OldChildFirstName',
          name: 'OldChildLastName',
          birthday: '2010-01-01',
          class: 'OldClass',
        },
      ],
      disciplines: ['OldSubject'],
    },
  ];

  async updateUserProfile(id: number, updateModifProfileDto: UpdateModifProfileDto) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateModifProfileDto };
    return this.users[userIndex];
  }
}
