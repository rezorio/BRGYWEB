import { Controller, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('Admin', 'Super Admin')
  @ApiOperation({ summary: 'Get all users (Admin endpoint)' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll() {
    const users = await this.usersService.findAllUsers();
    return users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.roles?.[0]?.name || 'Citizen',
      status: user.isActive ? 'Active' : 'Inactive',
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) : 'Unknown',
    }));
  }

  @Put(':id')
  @Roles('Admin', 'Super Admin')
  @ApiOperation({ summary: 'Update user profile (Admin endpoint)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') userId: string,
    @Body() updateData: {
      firstName?: string;
      lastName?: string;
      role?: string;
      status?: string;
    }
  ) {
    const isActive = updateData.status === 'Active';
    const updatedUser = await this.usersService.updateUser(userId, {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      role: updateData.role,
      isActive,
    });

    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.roles?.[0]?.name || 'Citizen',
      status: updatedUser.isActive ? 'Active' : 'Inactive',
      joinedDate: updatedUser.createdAt ? new Date(updatedUser.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) : 'Unknown',
    };
  }

  @Get('profile')
  @Roles('Citizen', 'Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return {
      message: 'User profile endpoint',
      user: req.user,
    };
  }

  @Get('moderator')
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Access administrative endpoint (Admin/Super Admin)' })
  @ApiResponse({ status: 200, description: 'Admin access granted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  moderatorOnly() {
    return { message: 'This endpoint is accessible by Admins and Super Admins' };
  }
}
