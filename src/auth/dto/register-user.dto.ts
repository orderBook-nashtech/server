import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsEmail()
    @Column({ unique: true })
    email?: string;

    @IsNotEmpty()
    @IsString()
    password?: string;
}