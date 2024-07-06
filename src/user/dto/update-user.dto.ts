import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @Column({ nullable: true })
    firstName: string;

    @IsString()
    @Column({ nullable: true })
    lastName?: string;

    @IsString()
    @Column({ nullable: true })
    address?: string;

    @IsString()
    @Column({ nullable: true })
    phoneNumber?: string;

    @IsEmail()
    @IsString()
    email?: string;

    @IsString()
    password?: string;

    @IsBoolean()
    isActive?: boolean;

    @IsBoolean()
    isAdmin?: boolean;

    @IsString()
    image?: string;
}
