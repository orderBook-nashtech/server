import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateShipperDto {
    @IsNotEmpty()
    @IsString()
    shipperName: string;

    @IsNotEmpty()
    @IsNumber()
    phone: string;

    @IsNotEmpty()
    @IsString()
    orderId: string
}
