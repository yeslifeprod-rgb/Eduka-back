import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateModifProfileDto } from './dto/update-modifprofile.dto';

@Injectable()
export class ProfileService {
  // Tableau d'objets Faker
  private users = [
    {
      id: 1,
      parents: {
        firstName: 'Véronique',
        lastName: 'Dupont',
        email: 'Veronique.dupont@gmail.com',
      },
      children: [
        {
          firstName: 'Sarah',
          name: 'Dupont',
          birthday: '2010-01-01',
          class: 'CM1',
        },
        {
          firstName: 'Paul',
          name: 'Dupont',
          birthday: '2012-05-01',
          class: 'CE2',
        },
      ],
      disciplines: ['Maths', 'Anglais'],
    },
  ];

  // Mettre à jour le profil d'un utilisateur par ID
  async updateUserProfile(id: number, updateModifProfileDto: UpdateModifProfileDto) {
    // Trouver l'index de l'utilisateur correspondant à l'ID fourni
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    // Fusionner les nouvelles données avec l'utilisateur existant et mettre à jour
    this.users[userIndex] = { ...this.users[userIndex], ...updateModifProfileDto };
    return this.users[userIndex];
  }

  // Récupérer le profil d'un utilisateur par ID
  async getUserProfile(id: number) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    return this.users[userIndex];
  }



// Supprimer le profil d'un utilisateur par ID
async deleteUserProfile(id: number) {
  const userIndex = this.users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    throw new NotFoundException('User not found');
  }
 // Modifie le tableau users avec splice 
  const [deletedUser] = this.users.splice(userIndex, 1);
  return { message: 'User deleted successfully', deletedUser };
}

  
}
