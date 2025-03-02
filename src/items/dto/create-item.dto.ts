import { IsString, IsNumber, Min, Length } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters long' })
  name: string;

  @IsNumber()
  price: number | 0;
}
