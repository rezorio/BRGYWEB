import { IsEmail, IsNotEmpty, IsString, MinLength, ArrayNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    description: 'User email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'User password (min 6 characters)',
    example: 'password123',
    minLength: 6,
    format: 'password'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'User first name',
    example: 'John',
    minLength: 2
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ 
    description: 'User last name',
    example: 'Doe',
    minLength: 2
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ 
    description: 'Array of role names to assign to user',
    example: ['Citizen'],
    isArray: true,
    enum: ['Citizen', 'Admin', 'Super Admin']
  })
  @IsString({ each: true })
  @ArrayNotEmpty()
  roleNames: string[];
}
