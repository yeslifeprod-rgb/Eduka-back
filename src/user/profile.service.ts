import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateModifProfileDto } from "./dto/update-modifprofile.dto";

@Injectable() 
export class ProfileService {
  // Tableau d'objets de faker
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

  // Mettre à jour le profil d'un utilisateur par ID
  async updateUserProfile(id: number, updateModifProfileDto: UpdateModifProfileDto) {
    // Trouver l'index de l'utilisateur correspondant à l'ID fourni
    const userIndex = this.users.findIndex(user => user.id === id); 
    if (userIndex === -1) {
      // Lancer une exception si l'utilisateur n'est pas trouvé
      throw new NotFoundException('User not found');
    }
    // Fusionner les nouvelles données avec l'utilisateur existant et mettre à jour
    this.users[userIndex] = { ...this.users[userIndex], ...updateModifProfileDto };
   
    return this.users[userIndex];
  }
}
