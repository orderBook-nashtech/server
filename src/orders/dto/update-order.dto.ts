import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsNumber()
    @IsOptional()
    totalPrice?: number;

    @IsString()
    @IsOptional()
    status?: OrderStatus;

    @IsDateString()
    @IsOptional()
    orderDate?: string;

    @IsString()
    @IsOptional()
    paymentMethod?: string;

    @IsString()
    @IsOptional()
    shipAddress?: string;

    @IsDateString()
    @IsOptional()
    shippedDate?: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    shipperId: string;
}
