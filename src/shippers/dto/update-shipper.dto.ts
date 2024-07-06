import { PartialType } from '@nestjs/mapped-types';
import { CreateShipperDto } from './create-shipper.dto';
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Order } from 'src/orders/entities/order.entity';

export class UpdateShipperDto extends PartialType(CreateShipperDto) {
    @IsNotEmpty()
    @IsString()
    shipperName?: string;

    @IsNotEmpty()
    @IsNumber()
    phone?: string;

    @IsNotEmpty()
    @IsString()
    orderId: string;
}
