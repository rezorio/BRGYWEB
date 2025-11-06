import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['roles'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateUser(userId: string, updateData: {
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update basic fields
    if (updateData.firstName) {
      user.firstName = updateData.firstName;
    }
    if (updateData.lastName) {
      user.lastName = updateData.lastName;
    }
    if (updateData.isActive !== undefined) {
      user.isActive = updateData.isActive;
    }

    // Update role if provided
    if (updateData.role) {
      const role = await this.roleRepository.findOne({
        where: { name: updateData.role },
      });
      if (role) {
        user.roles = [role];
      }
    }

    return await this.userRepository.save(user);
  }
}
