import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { profileCard } from 'src/interfaces/ProfileCard';
import { profileInterface } from 'src/interfaces/profileInterface';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async update(
    profileId: string,
    updateProfileDto: UpdateProfileDto,
    userId: string,
  ): Promise<boolean> {
    try {
      // Start a transaction to update the profile and children atomically
      await this.prisma.$transaction(async (prisma) => {
        // 1. Update the profile
        const profile = await prisma.profile.updateMany({
          where: {
            id: profileId,
            userId: userId, // Ensure only the owner can update
          },
          data: {
            firstname: updateProfileDto.firstname,
            lastname: updateProfileDto.lastname,
            photo: updateProfileDto.photo,
            address_id: updateProfileDto.address_id,
          },
        });

        if (!profile.count) {
          throw new Error('Profile not found or not authorized to update');
        }

        // 2. Update children
        const existingChildren = await prisma.children.findMany({
          where: { user_id: userId },
        });

        // Map the existing children by ID for quick lookup
        const existingChildrenMap = existingChildren.reduce((map, child) => {
          map[child.id] = child;
          return map;
        }, {});

        // Loop through the updated children data
        for (const childDto of updateProfileDto.children) {
          if (childDto.id) {
            // If the child ID exists, update the child
            if (existingChildrenMap[childDto.id]) {
              await prisma.children.update({
                where: { id: childDto.id },
                data: {
                  name: childDto.name,
                  birthday: new Date(childDto.birthday), // Convert to Date
                  class: childDto.class,
                },
              });
            }
          } else {
            // If no ID, create a new child
            await prisma.children.create({
              data: {
                name: childDto.name,
                birthday: new Date(childDto.birthday), // Convert to Date
                class: childDto.class,
                user_id: userId, // Directly assign user_id
                school_id: null, // If applicable, handle this or provide a default value
              } as Prisma.ChildrenUncheckedCreateInput, // Explicitly cast to ChildrenUncheckedCreateInput
            });
          }
        }

        // 3. Optionally: Remove any children that are no longer in the update data
        const updatedChildIds = updateProfileDto.children
          .filter((child) => child.id)
          .map((child) => child.id);
        await prisma.children.deleteMany({
          where: {
            user_id: userId,
            id: { notIn: updatedChildIds },
          },
        });
      });

      return true; // Successfully updated
    } catch (error) {
      console.error('Error updating profile:', error);
      return false; // Update failed
    }
  }

  async findProfilesByUserSchool(
    paginator: {
      skip: number;
      take: number;
    },
    userId: string,
  ): Promise<profileCard[]> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const userHasSchools = await this.prisma.userHasSchool.findMany({
      where: {
        user_id: user.id,
      },
    });

    const schoolIds = userHasSchools.map((entry) => entry.school_id);

    // Requête pour récupérer les profils des utilisateurs liés aux écoles
    const profiles = await this.prisma.profile.findMany({
      where: {
        user: {
          userHasSchool: {
            some: {
              school_id: {
                in: schoolIds,
              },
            },
          },
          roles: {
            some: {
              role: {
                name: 'PARENT',
              },
            },
          },
        },
      },
      skip: paginator.skip,
      take: paginator.take,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        photo: true,
        user: {
          select: {
            created_at: true, // Sélection du champ createdAt depuis User
            email: true,
          },
        },
      },
    });

    // Conversion des données vers le format `profileCard`
    return profiles.map((profile) => this.cardFormattedProfile(profile));
  }

  async findProfileById(id: string): Promise<profileCard> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        photo: true,
        user: {
          select: {
            created_at: true, // Sélection du champ createdAt depuis User
            email: true,
          },
        },
      },
    });
    if (!profile) {
      throw new Error('Profile not found');
    }
    return this.cardFormattedProfile(profile);
  }
  // Méthode pour formater le profil en `profileCard`
  private cardFormattedProfile(profile: {
    id: string;
    firstname: string;
    lastname: string;
    photo: string | null;
    user: {
      created_at: Date;
      email: string;
    };
  }): profileCard {
    return {
      id: profile.id,
      firstname: profile.firstname,
      lastname: profile.lastname,
      profil_picture: profile.photo || '',
      created_at: profile.user.created_at, // Utilisation de createdAt depuis User
      email: profile.user.email,
    };
  }
  async findDetailsProfileById(id: string): Promise<profileInterface> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        photo: true,
        address: { select: { address_line: true, city: true, zip_code: true } }, // Accéder aux infos de l'adresse via l'utilisateurtrue,
        user: {
          select: {
            created_at: true,
            email: true,
            children: {
              // Accéder aux enfants via l'utilisateur
              select: {
                id: true,
                name: true,
                birthday: true,
                class: true,
                created_at: true,
              },
              orderBy: {
                created_at: 'asc',
              },
            },
          },
        },
      },
    });
    if (!profile) {
      throw new Error('Profile not found');
    }
    return this.FormattedDetailsProfile(profile);
  }
  private FormattedDetailsProfile(profile: {
    id: string;
    firstname: string;
    lastname: string;
    photo: string | null;
    address: {
      address_line: string;
      city: string;
      zip_code: string;
    };
    user: {
      created_at: Date;
      email: string;
      children: Array<{
        id: string;
        name: string;
        class: string;
        birthday: Date;
        created_at: Date;
      }>;
    };
  }): profileInterface {
    return {
      id: profile.id,
      firstname: profile.firstname,
      lastname: profile.lastname,
      profil_picture: profile.photo || '',
      created_at: profile.user.created_at,
      email: profile.user.email,
      address: {
        address_line_1: profile.address.address_line,
        city: profile.address.city,
        zip_code: profile.address.zip_code,
      },
      children: profile.user.children?.length
        ? profile.user.children.map((child) => ({
            id: child.id,
            name: child.name,
            class: child.class,
            birthday: child.birthday,
            created_at: child.created_at,
          }))
        : [],
    };
  }
}
