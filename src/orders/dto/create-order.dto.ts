import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderitemDto } from '../../orderitems/dto/create-orderitem.dto';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    userId: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderitemDto)
    items: CreateOrderitemDto[];
  
    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;
  
    @IsString()
    @IsNotEmpty()
    shipAddress: string;
  
    @IsDateString()
    @IsNotEmpty()
    shippedDate: string;
  
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;
  
    @IsString()
    @IsNotEmpty()
    status: string;
  
    @IsDateString()
    @IsNotEmpty()
    orderDate: string;

    @IsDateString()
    @IsNotEmpty()
    shipperId: string;
}
