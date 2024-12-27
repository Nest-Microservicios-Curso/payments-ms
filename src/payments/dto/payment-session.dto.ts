import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymentSession {
  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  items: PaymentSessionItems[];
}

export class PaymentSessionItems {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  unit_price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
