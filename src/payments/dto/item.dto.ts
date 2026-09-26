import { IsString, IsPositive, IsNumber, IsInt } from 'class-validator';

export class ItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsPositive()
  @IsInt()
  quantity: number;
}

