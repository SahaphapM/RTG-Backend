import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @Length(3, 255, { message: 'Name must be between 3 and 255 characters long' })
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  // @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsString()
  taxId: string;

  @IsOptional()
  @IsString()
  agentName: string;

  @IsOptional()
  @IsString()
  agentEmail: string;

  @IsOptional()
  @IsString()
  agentContact: string;
}
