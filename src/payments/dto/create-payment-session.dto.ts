// create-payment-session.dto.ts
import { IsString, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemDto } from './item.dto';

export class CreatePaymentSessionDto {
  @IsString()
  orderId: string;

  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
