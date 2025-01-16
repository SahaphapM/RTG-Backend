import { IsString, IsEmail, Length, IsEnum, IsOptional } from 'class-validator';
import { User, UserRoles } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(3, 32, { message: 'Name must be between 3 and 32 characters long' })
  name: string;

  @IsString()
  @Length(2, 16, {
    message: 'Position must be between 2 and 16 characters long',
  })
  position: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsOptional()
  @IsString()
  @Length(8, 96, {
    message: 'Contact must be between 8 and 96 characters long',
  })
  contact?: string;

  @IsEnum(UserRoles)
  @IsString()
  role?: UserRoles = UserRoles.MANAGER; // default
}
