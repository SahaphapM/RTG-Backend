import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  Length,
} from 'class-validator';

export class CreateSubcontractorDto {
  @IsString()
  @Length(0, 64, { message: 'Name must be between 0 and 64 characters long' })
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 24, { message: 'Type must be between 0 and 24 characters long' })
  type?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, {
    message: 'Address must be between 0 and 500 characters long',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255, {
    message: 'Contact must be between 0 and 255 characters long',
  })
  contact?: string;

  @IsOptional()
  // @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  taxId?: string;
}
