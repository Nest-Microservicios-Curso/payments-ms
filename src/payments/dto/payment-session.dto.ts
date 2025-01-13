import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class PaymentSessionDto {
  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItemsDto)
  items: PaymentSessionItemsDto[];

  @IsString()
  @IsUUID()
  orderId: string;
}

export class PaymentSessionItemsDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  unit_price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
