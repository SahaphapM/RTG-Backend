import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  Length,
} from 'class-validator';

export class CreateSubcontractorDto {
  @IsString()
  @Length(0, 32, { message: 'Name must be between 3 and 32 characters long' })
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 24, { message: 'Type must be between 3 and 24 characters long' })
  type?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255, {
    message: 'Address must be between 5 and 255 characters long',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @Length(0, 64, {
    message: 'Contact must be between 8 and 64 characters long',
  })
  contact?: string;

  @IsOptional()
  // @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  taxId?: string;
}
