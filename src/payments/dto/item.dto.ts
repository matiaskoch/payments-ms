// item.dto.ts
import { IsString, IsPositive, IsNumber, IsIn } from 'class-validator';

export class ItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsPositive()
  quantity: number;
}