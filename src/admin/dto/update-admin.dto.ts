import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsString()
    password?: string;
}
